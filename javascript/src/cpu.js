function CPU(memorySize) {
    var i;

    this.memory = [];

    for (i = 0; i < memorySize; i++) {
        this.memory.push(0);
    }

    this.registers = {
        programCounter: 0,
        a: 0
    };
}

CPU.prototype.advanceProgramCounter = function() {
    this.registers.programCounter++;
};

CPU.prototype.readMemory = function() {
    return this.memory[this.registers.programCounter];
};

CPU.prototype.writeMemory = function(value, memoryLocation) {
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
                this.writeMemory(this.registers.a, this.readMemory());
                break;
            default:
                throw new Error('Unknown operation');
        }

        this.advanceProgramCounter();
    }
};