function generateRandomPhoneNumber() {
    const areaCode = Math.floor(Math.random() * 900) + 100; 
    const centralOfficeCode = Math.floor(Math.random() * 900) + 100; 
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;

    return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
}

module.exports = generateRandomPhoneNumber;
