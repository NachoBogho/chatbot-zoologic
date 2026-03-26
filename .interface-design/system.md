# Pantera Comercios — Widget Design System

## Direction
Naranja ámbar de la pantera sobre carbón oscuro. Warm ink (no cold navy). Comercio argentino: energía, velocidad, confianza. El header es oscuro y autoritativo; las burbujas son cálidas; el accento naranja unifica todo.

## Tokens
```css
--pt-orange:        #F97316   /* primary brand */
--pt-orange-dark:   #EA580C   /* hover */
--pt-orange-deep:   #C2410C   /* pressed */
--pt-gradient:      linear-gradient(135deg, #F97316 0%, #EA580C 100%)
--pt-gradient-dark: linear-gradient(160deg, #1C1917 0%, #292524 100%)
--pt-gradient-user: linear-gradient(135deg, #F97316 0%, #C2410C 100%)
--pt-ink:    #1C1917   /* warm stone-950 */
--pt-ink-2:  #44403C
--pt-ink-3:  #78716C
--pt-ink-4:  #A8A29E
--pt-surface:   #FFFFFF
--pt-surface-2: #FAFAF9   /* warm stone-50 */
--pt-border:      rgba(249, 115, 22, 0.18)
--pt-border-soft: rgba(28, 25, 23, 0.07)
--pt-shadow-lg:  0 24px 48px rgba(28, 25, 23, 0.20), 0 8px 24px rgba(28, 25, 23, 0.12)
--pt-shadow-btn: 0 4px 16px rgba(249, 115, 22, 0.50)
```

## Depth strategy
Shadows — subtle tinted with warm charcoal. Widget shadow uses ink-based shadows (not brand color) for premium feel. Button shadow uses brand orange for energy.

## Spacing base
4px unit. Components: 10-14px padding. Sections: 16-20px.

## Typography
Inter. Headlines: 700 -0.02em. Body: 400 -0.005em. Labels: 500 0.06em uppercase for badges.

## Key component patterns

### FAB Button
58×58 orange gradient, border-radius 50%, ptPop animation on mount, ptPulse ring when closed. Dots inside chat icon use --pt-orange to show through white bubble.

### Header
Dark gradient (1C1917 → 292524). Logo mark: 40×40 rounded-12 orange gradient square with white "P" icon. Brand badge: small orange-tinted "IA" pill. Green online dot with ptBlink animation.

### Messages
- Bot: white surface, border-soft, shadow-sm, radius 4px/16px/16px/16px, avatar = 28×28 rounded-9 "P" monogram
- User: orange gradient, radius 16px/4px/16px/16px, no border
- Full markdown rendering (bold, lists, numbered, URLs as links)

### Quick Reply Chips
Appear after welcome message, above input. White surface with border, pill shape. Hover → orange tint + orange border. Disappear after first user message (showQuickReplies state).

### Input
Textarea auto-resize. Border transitions: neutral → orange on focus with 3px orange tint ring. Background: surface-2 idle → surface focused. Send button: orange gradient when canSend, 38×38 rounded-10.

### Typing Indicator
Same 28×28 "P" avatar. Three orange dots with ptBounce staggered. Same bubble style as bot messages.
