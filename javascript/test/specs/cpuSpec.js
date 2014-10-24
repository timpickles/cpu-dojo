describe('CPU', function() {

    describe('Memory', function() {
        it('should be created to the specified length', function() {
            var cpu = new CPU(3);

            expect(cpu.memory.length).to.equal(3);
        });

        it('memory should all be zeroed', function() {
            var cpu = new CPU(3);

            expect(cpu.memory[0]).to.equal(0);
            expect(cpu.memory[1]).to.equal(0);
            expect(cpu.memory[2]).to.equal(0);
        });
    });

    describe('Registers', function() {
        var cpu = new CPU(3);
        before(function() {

        });

        it('program counter should start with value 0', function() {
            expect(cpu.registers.programCounter).to.equal(0);
        });

        it('A register should start with value 0', function() {
            expect(cpu.registers.a).to.equal(0);
        });
    });

    describe('Program Counter', function() {
        it('should advance program counter', function() {
            var cpu = new CPU(1);

            cpu.advanceProgramCounter();

            expect(cpu.registers.programCounter).to.equal(1);
        });
    });

    describe('Load Program', function() {
        it('should load the supplied program to memory', function() {
            var cpu = new CPU(3);

            cpu.loadProgram([1,2,3]);

            expect(cpu.memory[0]).to.equal(1);
            expect(cpu.memory[1]).to.equal(2);
            expect(cpu.memory[2]).to.equal(3);
        });

        it('should not overwrite any other area of memory', function() {
            var cpu = new CPU(5);

            cpu.loadProgram([1,2,3]);

            expect(cpu.memory[0]).to.equal(1);
            expect(cpu.memory[1]).to.equal(2);
            expect(cpu.memory[2]).to.equal(3);
            expect(cpu.memory[3]).to.equal(0);
            expect(cpu.memory[4]).to.equal(0);
        });

        it('should throw Error if the program is larger than the available memory', function() {
            var cpu = new CPU(1);

            expect(cpu.loadProgram.bind(cpu, [1,2,3])).to.throw(/the program is larger than the available memory/);
        });
    });

    describe('Operations', function() {
        it('LDA: should load the A register with value supplied in the next memory address', function() {
            var cpu = new CPU(5);

            cpu.loadProgram([1, 100]);
            cpu.execute();

            expect(cpu.registers.a).to.equal(100);
        });

        it('ADC: should add the value in the next memory address to the A register', function() {
            var cpu = new CPU(5);

            cpu.registers.a = 100;

            cpu.loadProgram([2, 7]);
            cpu.execute();

            expect(cpu.registers.a).to.equal(107);
        });

        it('STA: should store the value of the A register in the memory address referenced in the next memory location', function() {
            var cpu = new CPU(6);

            cpu.registers.a = 107;

            cpu.loadProgram([3, 5]);
            cpu.execute();

            expect(cpu.memory[5]).to.equal(107);
        });

        it('should throw error when operation not recognised', function() {
            var cpu = new CPU(5);

            cpu.loadProgram([255]);

            expect(cpu.execute.bind(cpu)).to.throw('Unknown operation');
        });
    });
});