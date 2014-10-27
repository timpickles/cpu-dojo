function CPU(memorySize) {
    var i;

    this.memory = [];

    for (i = 0; i < memorySize; i++) {
        this.memory.push(0);
    }

    this.registers = {
        programCounter: 0,
        a: 0,
        x: 0,
        y: 0,
        flags: {
            equal: false
        }
    };
}

CPU.prototype.advanceProgramCounter = function() {
    this.registers.programCounter++;
};

CPU.prototype.readMemory = function() {
    return this.memory[this.registers.programCounter];
};

CPU.prototype.writeMemory = function(memoryLocation, value) {
    return this.memory[memoryLocation] = value;
};

CPU.prototype.loadProgram = function(program) {
    var i;

    if (program.length > this.memory.length) {
        throw new Error('the program is larger than the available memory');
    }

    for (i = 0; i < program.length; i++) {
        this.memory[i] = program[i];
    }
};

CPU.prototype.execute = function() {
    var opCode,
        running = true;

    while(running) {
        opCode = this.readMemory();

        switch(opCode) {
            case 0:
                // BRK
                running = false;
                break;
            case 1:
                // LDA
                this.advanceProgramCounter();
                this.registers.a = this.readMemory();
                break;
            case 2:
                // ADC
                this.advanceProgramCounter();
                this.registers.a += this.readMemory();
                break;
            case 3:
                // STA
                this.advanceProgramCounter();
                this.writeMemory(this.readMemory(), this.registers.a);
                break;
            case 4:
                // LDX
                this.advanceProgramCounter();
                this.registers.x = this.readMemory();
                break;
            case 5:
                // INX
                this.registers.x++;
                break;
            case 6:
                // CMY
                this.advanceProgramCounter();
                this.registers.flags.equal = (this.registers.y === this.readMemory());
                break;
            case 7:
                // BNE
                this.advanceProgramCounter();
                if (!this.registers.flags.equal) {
                    this.registers.programCounter = this.registers.programCounter + this.readMemory();
                }
                break;
            case 8:
                // STA_X
                this.writeMemory(this.registers.x, this.registers.a);
                break;
            case 9:
                // DEY
                this.registers.y--;
                break;
            case 10:
                // LDY
                this.advanceProgramCounter();
                this.registers.y = this.readMemory();
                break;
            default:
                throw new Error('Unknown operation');
        }

        this.advanceProgramCounter();
    }
};