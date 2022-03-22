const fs = require('fs');
const readline = require('readline');



var parkingSpaces = new Array();

function processCommand(lineValue) {
    let fragments = lineValue.split(' ');
    let command =  fragments[0];
    let totalSlots,carNumber;

    switch(command) {
        case 'create': 
            totalSlots = fragments[1];
            createParkSlots(totalSlots);      
            break;
        case 'park': 
            carNumber = fragments[1];
            parkCar(carNumber);         
            break;
        case 'leave':
            const hoursParked = fragments[2];
            carNumber = fragments[1];
            leaveParking(carNumber, hoursParked);  
            break;
        case 'status':
            getStatus();
            break;
        default:
            console.log(`command ${command} was not recognized`);
            break;
    }

}

function createParkSlots(sizeValue) {
    if(sizeValue !== 0) {
        parkingSpaces.length = sizeValue;
        parkingSpaces.fill(null)
        console.log(`Created parkinglot with ${sizeValue} slots`);
    } else {
        console.error('0 slots provided');
    }
}

function parkCar(carValue) {
    if(parkingSpaces.length !== 0) {
        const nearestEmptySlot = parkingSpaces.findIndex((slot) => slot === null)
        if (nearestEmptySlot === -1) {
            console.log('Sorry, parking lot is full')
            return
        }

        parkingSpaces[nearestEmptySlot] = carValue

        console.log(`Allocated slot number: ${nearestEmptySlot + 1}`)

    }
}

function leaveParking(carNumber, hoursParked) {
    let carSlotFreed = 0;
    let chargeAmount = computeParkingAmt(hoursParked);


    if(parkingSpaces.length != 0) {
        carSlotFreed = parkingSpaces.indexOf(carNumber);
        if(carSlotFreed !== -1) {
            parkingSpaces[carSlotFreed] = null;
           console.log(`Registration Number ${carNumber} from Slot ${carSlotFreed + 1} has left with Charge ${chargeAmount}`);
        } else {
            console.log(`Registration Number ${carNumber} not found`);
        }
    }
    return;
}


function computeParkingAmt(hoursParkedVal) {
    const firstTwoHrs = 2;
    const increment = 10;
    const excessHours = Math.max(0, hoursParkedVal - firstTwoHrs);
    
    const totalAmt = 10 + (excessHours * increment);
    return totalAmt;
}

function getStatus() {
    let totalParkingSpacesLength = parkingSpaces.length;

    if(totalParkingSpacesLength != 0) {
        console.log('Slot No.  Registration No.');

        for(let i = 0; i < totalParkingSpacesLength; i++) {
            if(parkingSpaces[i] != null) {
                let slot = i + 1;
                console.log(`${slot}   ${parkingSpaces[i]}`);
            }
        }
    }
}

/**
 * Primary entrypoint for the application.
 * This assumes that the user provides a filename to read commands from
 * (accessibly via `process.argv[2]`).
 */
function main() {
    const fileName = process.argv[2];
    var lineReader = readline.createInterface({input: fs.createReadStream(fileName.toString())});
    lineReader.on('line', (line) => processCommand(line));
}


main();