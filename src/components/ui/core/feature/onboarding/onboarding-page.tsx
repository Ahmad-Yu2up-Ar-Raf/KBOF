'use client'

import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Check, ChevronRight, ChevronLeft, User, MapPin, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Input } from '@/components/ui/fragments/shadcn-ui/input'
import { Label } from '@/components/ui/fragments/shadcn-ui/label'
import { Textarea } from '@/components/ui/fragments/shadcn-ui/textarea'
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { Logo } from '@/components/icons/app-logo-icon'
import { authClient } from '@/lib/auth/auth-client'
import {
  completeOnboarding,
  checkUsernameAvailability,
} from '@/lib/server/user/user-server-actions'
import { destinationCategory, destinationType } from '@/db/schema'
import { formatLabel } from '@/lib/format'

const STEPS = [
  { id: 1, title: 'Profil', icon: User },
  { id: 2, title: 'Asal Daerah', icon: MapPin },
  { id: 3, title: 'Preferensi', icon: Heart },
]

interface OnboardingData {
  step1: {
    fullName: string
    username: string
    bio: string
  }
  step2: {
    province: string
    city: string
    hobbies: string[]
    expertise: string[]
    motivation: string
  }
  step3: {
    favoriteCategories: string[]
    interestedTypes: string[]
    notificationPreferences: {
      email: boolean
      push: boolean
      newsletter: boolean
    }
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [usernameError, setUsernameError] = React.useState<string | null>(null)
  const [checkingUsername, setCheckingUsername] = React.useState(false)

  const completeOnboardingFn = useServerFn(completeOnboarding)
  const checkUsernameFn = useServerFn(checkUsernameAvailability)

  const [data, setData] = React.useState<OnboardingData>({
    step1: {
      fullName: session?.user?.name ?? '',
      username: '',
      bio: '',
    },
    step2: {
      province: '',
      city: '',
      hobbies: [],
      expertise: [],
      motivation: '',
    },
    step3: {
      favoriteCategories: [],
      interestedTypes: [],
      notificationPreferences: {
        email: true,
        push: true,
        newsletter: false,
      },
    },
  })

  // Debounced username check
  React.useEffect(() => {
    const username = data.step1.username
    if (username.length < 3) {
      setUsernameError(null)
      return
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true)
      try {
        const result = await checkUsernameFn({ data: username })
        if (!result.available) {
          setUsernameError('Username sudah digunakan')
        } else {
          setUsernameError(null)
        }
      } catch {
        setUsernameError(null)
      } finally {
        setCheckingUsername(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [data.step1.username])

  const updateStep1 = (field: keyof OnboardingData['step1'], value: string) => {
    setData((prev) => ({
      ...prev,
      step1: { ...prev.step1, [field]: value },
    }))
  }

  const updateStep2 = (
    field: keyof OnboardingData['step2'],
    value: string | string[]
  ) => {
    setData((prev) => ({
      ...prev,
      step2: { ...prev.step2, [field]: value },
    }))
  }

  const updateStep3 = (
    field: keyof OnboardingData['step3'],
    value: string[] | OnboardingData['step3']['notificationPreferences']
  ) => {
    setData((prev) => ({
      ...prev,
      step3: { ...prev.step3, [field]: value },
    }))
  }

  const toggleArrayItem = (
    step: 'step2' | 'step3',
    field: 'hobbies' | 'expertise' | 'favoriteCategories' | 'interestedTypes',
    item: string
  ) => {
    setData((prev) => {
      const stepData = prev[step]
      // Type-safe access based on field name
      let currentArray: string[] = []
      if (step === 'step2' && (field === 'hobbies' || field === 'expertise')) {
        currentArray = prev.step2[field]
      } else if (step === 'step3' && (field === 'favoriteCategories' || field === 'interestedTypes')) {
        currentArray = prev.step3[field]
      }
      
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item]
      return {
        ...prev,
        [step]: { ...stepData, [field]: newArray },
      }
    })
  }

  const validateStep1 = () => {
    if (!data.step1.fullName || data.step1.fullName.length < 2) {
      toast.error('Nama lengkap minimal 2 karakter')
      return false
    }
    if (!data.step1.username || data.step1.username.length < 3) {
      toast.error('Username minimal 3 karakter')
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(data.step1.username)) {
      toast.error('Username hanya boleh huruf, angka, dan underscore')
      return false
    }
    if (usernameError) {
      toast.error(usernameError)
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1)
      return
    }

    setIsSubmitting(true)
    try {
      await completeOnboardingFn({
        data: {
          step1: data.step1,
          step2: data.step2,
          step3: data.step3,
        },
      })
      toast.success('Selamat! Profil kamu sudah lengkap.')
      router.navigate({ to: '/profile' })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan profil. Silakan coba lagi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    if (!validateStep1()) {
      return
    }

    setIsSubmitting(true)
    try {
      await completeOnboardingFn({
        data: {
          step1: data.step1,
        },
      })
      toast.success('Selamat! Profil kamu sudah dibuat.')
      router.navigate({ to: '/profile' })
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan profil. Silakan coba lagi.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold">Suasana</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Lengkapi profil kamu
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-2xl py-8 px-4">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full transition-colors',
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-8 h-0.5 mx-1',
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>
                  Lengkapi informasi dasar untuk profil kamu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={data.step1.fullName}
                    onChange={(e) => updateStep1('fullName', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      value={data.step1.username}
                      onChange={(e) =>
                        updateStep1(
                          'username',
                          e.target.value.toLowerCase().replace(/\s/g, '')
                        )
                      }
                      placeholder="username_kamu"
                      className={usernameError ? 'border-destructive' : ''}
                    />
                    {checkingUsername && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Spinner className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {usernameError && (
                    <p className="text-xs text-destructive">{usernameError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Hanya huruf, angka, dan underscore
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Opsional)</Label>
                  <Textarea
                    id="bio"
                    value={data.step1.bio}
                    onChange={(e) => updateStep1('bio', e.target.value)}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Asal Daerah</CardTitle>
                <CardDescription>
                  Bagikan dari mana kamu berasal (opsional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input
                      id="province"
                      value={data.step2.province}
                      onChange={(e) => updateStep2('province', e.target.value)}
                      placeholder="Contoh: Jawa Tengah"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten</Label>
                    <Input
                      id="city"
                      value={data.step2.city}
                      onChange={(e) => updateStep2('city', e.target.value)}
                      placeholder="Contoh: Semarang"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivasi Bergabung</Label>
                  <Textarea
                    id="motivation"
                    value={data.step2.motivation}
                    onChange={(e) => updateStep2('motivation', e.target.value)}
                    placeholder="Apa yang memotivasimu untuk bergabung di Suasana?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>Preferensi</CardTitle>
                <CardDescription>
                  Pilih kategori dan tipe destinasi yang kamu minati (opsional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Kategori Favorit</Label>
                  <div className="flex flex-wrap gap-2">
                    {destinationCategory.enumValues.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant={
                          data.step3.favoriteCategories.includes(cat)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() =>
                          toggleArrayItem('step3', 'favoriteCategories', cat)
                        }
                      >
                        {formatLabel(cat)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Tipe Destinasi yang Diminati</Label>
                  <div className="flex flex-wrap gap-2">
                    {destinationType.enumValues.map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={
                          data.step3.interestedTypes.includes(type)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() =>
                          toggleArrayItem('step3', 'interestedTypes', type)
                        }
                      >
                        {formatLabel(type)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Notifikasi</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="notif-email"
                        checked={data.step3.notificationPreferences.email}
                        onCheckedChange={(checked) =>
                          updateStep3('notificationPreferences', {
                            ...data.step3.notificationPreferences,
                            email: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="notif-email" className="font-normal">
                        Notifikasi email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="notif-newsletter"
                        checked={data.step3.notificationPreferences.newsletter}
                        onCheckedChange={(checked) =>
                          updateStep3('notificationPreferences', {
                            ...data.step3.notificationPreferences,
                            newsletter: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="notif-newsletter" className="font-normal">
                        Berlangganan newsletter
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 pt-0">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {currentStep === 1 && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                >
                  Lewati
                </Button>
              )}
              {currentStep < 3 ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Lanjut
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    'Selesai'
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
