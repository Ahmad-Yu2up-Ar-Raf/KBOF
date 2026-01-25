# Mini Quiz Game - Manual Test Checklist

## Test Cases

### 1. Menu Screen

- [ ] Menu screen displays correctly on load
- [ ] "Mulai Bermain" button navigates to level selection
- [ ] High scores section shows correctly (empty state if no scores)
- [ ] How to play section displays all steps
- [ ] Keyboard shortcuts info is visible
- [ ] Back button (←) navigates to homepage

### 2. Level Selection

- [ ] All three levels (Easy, Medium, Hard) display correctly
- [ ] Level cards show correct info:
  - Easy: 🌱 Mudah, 20s, 10 poin, hints enabled
  - Medium: 🌿 Sedang, 25s, 20 poin, hints with penalty
  - Hard: 🔥 Sulit, 30s, 30 poin, no hints
- [ ] Clicking a level card starts the game
- [ ] Back button returns to menu
- [ ] Keyboard navigation (Tab + Enter) works

### 3. Game Play - Easy Level

- [ ] Full image displays correctly
- [ ] Timer starts at 20 seconds
- [ ] Timer counts down every second
- [ ] Timer turns orange at 5 seconds (warning)
- [ ] Timer turns red + pulses at 3 seconds (critical)
- [ ] Hint button is visible and clickable
- [ ] Clicking hint shows hint text
- [ ] Answer choices (1-4) display correctly
- [ ] Clicking an answer highlights it
- [ ] "Jawab" button submits the answer
- [ ] Correct answer shows green feedback + 🎉
- [ ] Wrong answer shows red feedback with correct answer
- [ ] Fun fact displays on correct answer
- [ ] Auto-advance after 1.2 seconds

### 4. Game Play - Medium Level

- [ ] Image shows 3 fragments only
- [ ] Fragments have dashed border
- [ ] "3 fragmen" badge displays
- [ ] Timer starts at 25 seconds
- [ ] Hint available but shows penalty (-5 poin)
- [ ] Using hint reduces final score

### 5. Game Play - Hard Level

- [ ] Image shows only 1 small fragment
- [ ] Timer starts at 30 seconds
- [ ] No hint button available
- [ ] Full image reveals on answer

### 6. Timer & Timeout

- [ ] Timer reaching 0 shows "Waktu habis!" message
- [ ] Timeout counts as wrong answer
- [ ] No points awarded on timeout
- [ ] Auto-advance after timeout feedback

### 7. Scoring System

- [ ] Base points awarded for correct answer
- [ ] Time bonus (25%) when >50% time remaining
- [ ] Hint penalty applied on medium level
- [ ] 0 points for wrong/timeout answers
- [ ] Score accumulates across questions

### 8. Stats Panel (Results Screen)

- [ ] Final score displays prominently
- [ ] "Skor Tertinggi Baru!" badge if applicable
- [ ] Accuracy percentage shows correctly
- [ ] Correct/total count is accurate
- [ ] Average time per question calculated
- [ ] Question breakdown shows each result
- [ ] Time bonus indicator (⚡) shows when applicable
- [ ] Hint usage indicator (💡) shows when used

### 9. Navigation Buttons (Stats)

- [ ] "Main Lagi" restarts same level
- [ ] "Ganti Level" returns to level selection
- [ ] "Menu Utama" returns to main menu

### 10. High Score Persistence

- [ ] Score saved to cookies after game
- [ ] High scores persist after page refresh
- [ ] Each level has separate high scores
- [ ] Max 3 scores kept per level
- [ ] Scores sorted highest to lowest

### 11. Keyboard Navigation

- [ ] Number keys 1-4 select answers
- [ ] Enter key submits answer
- [ ] H key shows hint (when available)
- [ ] Escape key pauses game

### 12. Pause Feature

- [ ] Escape pauses the game
- [ ] Timer stops when paused
- [ ] Overlay shows "Permainan Dijeda"
- [ ] "Lanjutkan" button resumes game
- [ ] Timer Lanjutkans from paused time

### 13. Responsive Design

- [ ] Mobile view (< 640px): Cards stack vertically
- [ ] Tablet view (640px - 1024px): 2-column grid
- [ ] Desktop view (> 1024px): Full layout
- [ ] Touch interactions work on mobile
- [ ] Buttons have appropriate tap targets

### 14. Animations

- [ ] Page transitions are smooth
- [ ] Timer number animates on change
- [ ] Answer feedback animates in
- [ ] Level cards animate with stagger
- [ ] Score reveal animates on stats screen

### 15. Edge Cases

- [ ] Game works with minimum questions per level
- [ ] Empty high scores handled gracefully
- [ ] Rapid clicking doesn't break state
- [ ] Browser back button handled
- [ ] Page refresh during game resets to menu

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Performance

- [ ] Images load quickly
- [ ] No visible lag during gameplay
- [ ] Animations run at 60fps
- [ ] Memory usage stable during gameplay

## Accessibility

- [ ] Focus indicators visible
- [ ] Screen reader announces changes
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard-only navigation possible
