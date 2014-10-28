var Assembler = (function() {
    var blankLineRegEx = /^\s*$/,
        operationRegEx = /^\s*(\w+)(?:\s+([\d\w-]+))?\s*$/,
        operationMap = {
            'BRK': { opCode: 0, length: 1 },
            'LDA': { opCode: 1, length: 2 },
            'ADC': { opCode: 2, length: 2 },
            'STA': { opCode: 3, length: 2 },
            'LDX': { opCode: 4, length: 2 },
            'INX': { opCode: 5, length: 1 },
            'CMY': { opCode: 6, length: 2 },
            'BNE': { opCode: 7, length: 2 },
            'STA_X': { opCode: 8, length: 1 },
            'DEY': { opCode: 9, length: 1 },
            'LDY': { opCode: 10, length: 2 },
            'JSR': { opCode: 11, length: 2 },
            'RTS': { opCode: 12, length: 1 }
        };

    return {
        assemble: function(assemblyCode) {
            if (!assemblyCode) return [];

            var lines = assemblyCode.split('\n'),
                machineCode = [],
                line,
                i,
                groups,
                operation,
                value,
                operationName;

            for(i = 0; i < lines.length; i++) {
                line = lines[i];

                console.log(line);

                if (blankLineRegEx.test(line)) {
                    continue;
                }

                if (groups = operationRegEx.exec(line)) {
                    operationName = groups[1];
                    operation = operationMap[operationName];
                    try {
                        value = parseInt(groups[2], 10);
                    } catch (e) {
                        value = groups[2];
                    }

                    if (operation.length == 1) {
                        machineCode.push(operation.opCode);
                    } else {
                        machineCode = machineCode.concat([operation.opCode, value]);
                    }
                }
            }

            return machineCode;
        }
    }
});