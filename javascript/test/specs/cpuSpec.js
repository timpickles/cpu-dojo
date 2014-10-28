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

        it('X register should start with value 0', function() {
            expect(cpu.registers.x).to.equal(0);
        });

        it('Y register should start with value 0', function() {
            expect(cpu.registers.y).to.equal(0);
        });

        it('Flag equal should start with value false', function() {
            expect(cpu.registers.flags.equal).to.be.false;
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
        it('should throw error when operation not recognised', function() {
            var cpu = new CPU(5);

            cpu.loadProgram([255]);

            expect(cpu.execute.bind(cpu)).to.throw('Unknown operation');
        });

        it ('BRK: should increase the program counter by one and stop the CPU', function() {
            var cpu = new CPU(5);

            cpu.loadProgram([0]);
            cpu.execute();

            expect(cpu.registers.programCounter).to.equal(1);
        });

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

        it('STA_X: should store the value of the A register in the memory address referenced in the X register', function() {
            var cpu = new CPU(6);

            cpu.registers.a = 107;
            cpu.registers.x = 5;

            cpu.loadProgram([8]);
            cpu.execute();

            expect(cpu.memory[5]).to.equal(107);
        });

        it('LDX: should load value in the next memory address to the X register', function() {
            var cpu = new CPU(3);

            cpu.loadProgram([4, 99]);
            cpu.execute();

            expect(cpu.registers.x).to.equal(99);
        });

        it('INX: should increase the value in the X register by one', function() {
            var cpu = new CPU(5);

            cpu.registers.x = 99;

            cpu.loadProgram([5]);
            cpu.execute();

            expect(cpu.registers.x).to.equal(100);
        });

        it('DEY: should decrease the value in the Y register by one', function() {
            var cpu = new CPU(5);

            cpu.registers.y = 101;

            cpu.loadProgram([9]);
            cpu.execute();

            expect(cpu.registers.y).to.equal(100);
        });

        it('LDY: should load value in the next memory address to the Y register', function() {
            var cpu = new CPU(3);

            cpu.loadProgram([10, 123]);
            cpu.execute();

            expect(cpu.registers.y).to.equal(123);
        });

        it('CMY: should compare the value in register Y to the value in the next memory address and set the equal flag to true', function() {
            var cpu = new CPU(3);

            cpu.registers.y = 123;

            cpu.loadProgram([6, 123]);
            cpu.execute();

            expect(cpu.registers.flags.equal).to.be.true;
        });

        it('CMY: should compare the value in register Y to the value in the next memory address and set the equal flag to false', function() {
            var cpu = new CPU(3);

            cpu.registers.y = 123;

            cpu.loadProgram([6, 100]);
            cpu.execute();

            expect(cpu.registers.flags.equal).to.be.false;
        });

        it('BNE: should add the number in the next memory address to the program counter if the equal flag is set to false', function() {
            var cpu = new CPU(10);

            cpu.registers.programCounter = 3;
            cpu.registers.flags.equal = false;

            cpu.loadProgram([0, 0, 0, 7, -5]);
            try {
                cpu.execute();
            } catch (e) {
                expect(e.message).to.equal('BRK command encountered. Terminating CPU');
            }

            expect(cpu.registers.programCounter).to.equal(1); // because BRK increase the program counter by one
        });

        it('BNE: should not add the number in the next memory address to the program counter if the equal flag is set to true', function() {
            var cpu = new CPU(10);

            cpu.registers.programCounter = 5;
            cpu.registers.flags.equal = true;

            cpu.loadProgram([0, 0, 0, 7, -5, 0]);
            cpu.execute();

            expect(cpu.registers.programCounter).to.equal(6);
        });

        it('JSR: should jump to location specified in the next memory address and add the current program counter - 1 to the stack', function() {
            var cpu = new CPU(50);

            cpu.registers.programCounter = 3;

            cpu.loadProgram([0, 0, 0, 11, 9]);
            cpu.execute();

            expect(cpu.registers.programCounter).to.equal(10);
            expect(cpu.registers.stackPointer).to.equal(cpu.memory.length - 2);
            expect(cpu.memory[cpu.memory.length - 1]).to.equal(3);
        });


        it('RTS: should pop the stack and set the program counter to that value - 1', function() {
            var cpu = new CPU(50);

            cpu.registers.programCounter = 3;
            cpu.memory[cpu.memory.length - 1] = 0;
            cpu.registers.stackPointer = cpu.memory.length - 2;

            cpu.loadProgram([0, 0, 0, 12]);
            cpu.execute();

            expect(cpu.registers.programCounter).to.equal(1);
            expect(cpu.registers.stackPointer).to.equal(cpu.memory.length - 1);
        });
    });

    describe('Programs', function() {
        it ('should write "who let the dogs out who who who " to the memory from address 128 onwards', function() {
            var cpu = new CPU(256),
                expectedMessage = 'who let the dogs out who who who ';

            cpu.loadProgram([4, 128, 1, 0x77, 8, 5, 1, 0x68, 8, 5, 1, 0x6F, 8, 5, 1, 0x20, 8, 5, 1, 0x6c, 8, 5, 1, 0x65, 8, 5, 1, 0x74, 8, 5, 1, 0x20, 8, 5, 1, 0x74, 8, 5, 1, 0x68, 8, 5, 1, 0x65, 8, 5, 1, 0x20, 8, 5, 1, 0x64, 8, 5, 1, 0x6F, 8, 5, 1, 0x67, 8, 5, 1, 0x73, 8, 5, 1, 0x20, 8, 5, 1, 0x6F, 8, 5, 1, 0x75, 8, 5, 1, 0x74, 8, 5, 1, 0x20, 8, 5, 10, 3, 1, 0x77, 8, 5, 1, 0x68, 8, 5, 1, 0x6F, 8, 5, 1, 0x20, 8, 5, 9, 6, 0, 7, -21, 0]);
            cpu.execute();

            var message = '',
                value;
            for (var i = 128; i < 255; i++) {
                value = cpu.memory[i];
                if (value === 0) {
                    break;
                }

                message += String.fromCharCode(value);
            }

            expect(message).to.equal(expectedMessage);
        });
    });
});