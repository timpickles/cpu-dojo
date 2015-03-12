LDX 128

JSR who
JSR space
JSR let
JSR space
JSR the
JSR space
JSR dogs
JSR space
JSR out

LDY 3

loop:
  DEY
  JSR space
  JSR who
  CMY 0
  BNE loop

BRK

who:
  LDA 119
  JSR writechar
  LDA 104
  JSR writechar
  LDA 111
  JSR writechar
  RTS

let:
  LDA 108
  JSR writechar
  LDA 101
  JSR writechar
  LDA 116
  JSR writechar
  RTS

the:
  LDA 116
  JSR writechar
  LDA 104
  JSR writechar
  LDA 101
  JSR writechar
  RTS

dogs:
  LDA 100
  JSR writechar
  LDA 111
  JSR writechar
  LDA 103
  JSR writechar
  LDA 115
  JSR writechar
  RTS

out:
  LDA 111
  JSR writechar
  LDA 117
  JSR writechar
  LDA 116
  JSR writechar
  RTS

space:
  LDA 32
  JSR writechar
  RTS

writechar:
  STA_X
  INX
  RTS