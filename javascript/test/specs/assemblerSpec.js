describe('Assembler', function() {

    describe('Whitespace and Comments', function () {
        var assembler = new Assembler();

        it('should return empty array of machine code with blank input', function () {
            var code = '',
                outputMachineCode = assembler.assemble(code);

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should return empty array of machine code with undefined input', function () {
            var outputMachineCode = assembler.assemble();

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should skip blank lines', function () {
            var code = [
                '',
                ''
            ].join('\n');

            var outputMachineCode = assembler.assemble(code);

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should skip comments', function () {
            var code = [
                '; start of line',
                '  ; at some point line'
            ].join('\n');

            var outputMachineCode = assembler.assemble(code);

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should ignore comments after code', function () {
            var code = [
                'LDA 100 ; some comment',
                '  LDA 100       ; some other comment'
            ].join('\n');

            var outputMachineCode = assembler.assemble(code);

            expect(outputMachineCode).to.deep.equal([1, 100, 1, 100]);
        });
    });

    describe('Assembly', function() {
        var assembler = new Assembler();

        it('should compile the first dojo program to machine code', function() {
            var code = [
                'LDA 100',
                'ADC 7',
                'STA 5',
                'BRK'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            expect(machineCode).to.deep.equal([1, 100, 2, 7, 3, 5, 0]);
        });

        it('should compile the second dojo program to machine code', function() {
            var code = [
                'LDX 128',

                'LDA 119',
                'STA_X',
                'INX',
                'LDA 104',
                'STA_X',
                'INX',
                'LDA 111',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'LDA 108',
                'STA_X',
                'INX',
                'LDA 101',
                'STA_X',
                'INX',
                'LDA 116',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'LDA 116',
                'STA_X',
                'INX',
                'LDA 104',
                'STA_X',
                'INX',
                'LDA 101',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'LDA 100',
                'STA_X',
                'INX',
                'LDA 111',
                'STA_X',
                'INX',
                'LDA 103',
                'STA_X',
                'INX',
                'LDA 115',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'LDA 111',
                'STA_X',
                'INX',
                'LDA 117',
                'STA_X',
                'INX',
                'LDA 116',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'LDY 3',

                'LDA 119',
                'STA_X',
                'INX',
                'LDA 104',
                'STA_X',
                'INX',
                'LDA 111',
                'STA_X',
                'INX',
                'LDA 32',
                'STA_X',
                'INX',

                'DEY',
                'CMY 0',
                'BNE -21',

                'BRK'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            expect(machineCode).to.deep.equal([
                4, 128,
                1, 0x77, 8, 5, 1, 0x68, 8, 5, 1, 0x6F, 8, 5, 1, 0x20, 8, 5,
                1, 0x6c, 8, 5, 1, 0x65, 8, 5, 1, 0x74, 8, 5, 1, 0x20, 8, 5,
                1, 0x74, 8, 5, 1, 0x68, 8, 5, 1, 0x65, 8, 5, 1, 0x20, 8, 5,
                1, 0x64, 8, 5, 1, 0x6F, 8, 5, 1, 0x67, 8, 5, 1, 0x73, 8, 5, 1, 0x20, 8, 5,
                1, 0x6F, 8, 5, 1, 0x75, 8, 5, 1, 0x74, 8, 5, 1, 0x20, 8, 5,

                10, 3,

                1, 0x77, 8, 5, 1, 0x68, 8, 5, 1, 0x6F, 8, 5, 1, 0x20, 8, 5,

                9, 6, 0, 7, -21,

                0
            ]);
        });

        it('should use labels for branching', function() {
            var code = [
                'LDY 3',
                'loop:',
                '  DEY',
                '  CMY 0',
                '  BNE loop',
                'BRK'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            expect(machineCode).to.deep.equal([10, 3, 9, 6, 0, 7, -5, 0]);
        });

        it('should use labels for subroutines', function() {
            var code = [
                'LDA 10',
                'JSR incABy10',
                'BRK',

                'incABy10:',
                '  ADC 10',
                '  RTS'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            expect(machineCode).to.deep.equal([1, 10, 11, 5, 0, 2, 10, 12]);
        });

        it('should use labels for nested subroutines', function() {
            var code = [
                'LDA 10',
                'JSR incABy10',
                'BRK',

                'incABy10:',
                '  ADC 10',
                '  JSR incABy50',
                '  RTS',

                'incABy50:',
                '  ADC 50',
                '  RTS'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            expect(machineCode).to.deep.equal([1, 10, 11, 5, 0, 2, 10, 11, 10, 12, 2, 50, 12]);
        });

        it('should use labels for multiple subroutines', function() {
            var code = [
                'LDX 128',
                '',
                'JSR who',
                'JSR space',
                'JSR let',
                'JSR space',
                'JSR the',
                'JSR space',
                'JSR dogs',
                'JSR space',
                'JSR out',
                '',
                'LDY 3',
                '',
                'loop:',
                '  DEY',
                '  JSR space',
                '  JSR who',
                '  CMY 0',
                '  BNE loop',
                '',
                'BRK',
                '',
                'who:',
                '  LDA 119',
                '  JSR writechar',
                '  LDA 104',
                '  JSR writechar',
                '  LDA 111',
                '  JSR writechar',
                '  RTS',
                '',
                'let:',
                '  LDA 108',
                '  JSR writechar',
                '  LDA 101',
                '  JSR writechar',
                '  LDA 116',
                '  JSR writechar',
                '  RTS',
                '',
                'the:',
                '  LDA 116',
                '  JSR writechar',
                '  LDA 104',
                '  JSR writechar',
                '  LDA 101',
                '  JSR writechar',
                '  RTS',
                '',
                'dogs:',
                '  LDA 100',
                '  JSR writechar',
                '  LDA 111',
                '  JSR writechar',
                '  LDA 103',
                '  JSR writechar',
                '  LDA 115',
                '  JSR writechar',
                '  RTS',
                '',
                'out:',
                '  LDA 111',
                '  JSR writechar',
                '  LDA 117',
                '  JSR writechar',
                '  LDA 116',
                '  JSR writechar',
                '  RTS',
                '',
                'space:',
                '  LDA 32',
                '  JSR writechar',
                '  RTS',
                '',
                'writechar:',
                '  STA_X',
                '  INX',
                '  RTS'
            ].join('\n');

            var machineCode = assembler.assemble(code);

            console.log('****');
            console.log(machineCode.join(', '));

            expect(machineCode).to.deep.equal([4, 128, 11, 32, 11, 101, 11, 45, 11, 101, 11, 58, 11, 101, 11, 71, 11, 101, 11, 88, 10, 3, 9, 11, 101, 11, 32, 6, 0, 7, -9, 0, 1, 119, 11, 106, 1, 104, 11, 106, 1, 111, 11, 106, 12, 1, 108, 11, 106, 1, 101, 11, 106, 1, 116, 11, 106, 12, 1, 116, 11, 106, 1, 104, 11, 106, 1, 101, 11, 106, 12, 1, 100, 11, 106, 1, 111, 11, 106, 1, 103, 11, 106, 1, 115, 11, 106, 12, 1, 111, 11, 106, 1, 117, 11, 106, 1, 116, 11, 106, 12, 1, 32, 11, 106, 12, 8, 5, 12]);
        });
    });
});