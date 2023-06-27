const  calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate); 
    const diffYears = end.getFullYear() - start.getFullYear();
    const diffMonths = end.getMonth() - start.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;
    
    return totalMonths;
}


module.exports = calculateDuration