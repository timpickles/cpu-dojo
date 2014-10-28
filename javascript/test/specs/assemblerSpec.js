describe('Assembler', function() {

    describe('Whitespace and Comments', function () {
        var assembler = new Assembler();

        it('should return empty array of machine code with blank input', function () {
            var code = '',
                outputMachineCode = assembler.assemble('');

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should return empty array of machine code with undefined input', function () {
            var code = '',
                outputMachineCode = assembler.assemble();

            expect(outputMachineCode).to.deep.equal([]);
        });

        it('should skip blank lines', function () {
            var code = [
                '',
                ''
            ].join('\n');

            var outputMachineCode = assembler.assemble();

            expect(outputMachineCode).to.deep.equal([]);
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
    });
});