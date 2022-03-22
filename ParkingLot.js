const fs = require('fs');
const readline = require('readline');


const fileName = process.argv.splice(2);
console.log(fileName);

readFile(fileName.toString());


var parkingSpaces = new Array();
var totalParkingSpace = 0;

async function readFile(fileName) {

    var lineReader = readline.createInterface({
        input: fs.createReadStream(fileName)
    });

    
    lineReader.on('line', function(line) {
        //console.log('line from file', line);

        processCommand(line);
    });
}


function processCommand(lineValue) {
    var command = lineValue.split(' ')[0];
    var totalSlots, carSlotNumber, parkingSlotNumber, hoursParked;

    switch(command) {
        case 'create': 
            totalSlots = lineValue.split(' ')[1];
            createParkSlots(totalSlots);
            console.log(`Created parkinglot with ${totalSlots} slots`);
            break;
        case 'park': 
            carSlotNumber = parkCar(lineValue);
            
            if(carSlotNumber != -1) {
                console.log(`Allocated slot number: ${carSlotNumber}`);
            } else {
                console.log(`Sorry, parking lot is full`);
            }
            break;
        case 'leave':
            let hoursParked = lineValue.split(' ')[2];
            let carNumber = lineValue.split(' ')[1];
            let slotNum = leaveParking(carNumber);
            let chargeAmount = computeParkingAmt(hoursParked);

            if(slotNum != -1) {
                console.log(`Registration Number ${carNumber} from Slot ${slotNum + 1} has left with Charge ${chargeAmount}`);
            } else {
                console.log(`Registration Number ${carNumber} not found`);
            }
            break;
        case 'status':

            let stat = getStatus();

            if(stat.length > 1) {
                console.log(stat.join('\n'));
            }
        default:
            break;
    }

}

function createParkSlots(sizeValue) {
    if(sizeValue != 0) {
        for(let i = 0; i < sizeValue; i++) {
            parkingSpaces.push(null);
        }
        totalParkingSpace = sizeValue;
    } else {
        console.error('0 slots provided');
    }
}

function parkCar(carValue) {
    let totalParkingSpacesLength = parkingSpaces.length;
    let carNumber  = carValue.split(' ')[1];

    if(totalParkingSpacesLength != 0) {
        if(findNearestSlots()){
            for(let i = 0; i < totalParkingSpacesLength; i++) {
                // console.log(carNumber);
                if(parkingSpaces[i]== null) {
                    if(carNumber){
                        parkingSpaces[i] = carNumber;
                        i++;
                        // console.log(parkingSpaces[i]);
                        return i;
                    }
                } 
            }
        } else {
            return -1;
        }
    }
}

function findNearestSlots() {
    let nearest = false;

    for(let i = 0; i < parkingSpaces.length; i++) {
        if(parkingSpaces[i] == null) {
            nearest = true;
        }
    }
    return nearest;
}


function leaveParking(carNumber) {
    //find carNumber in the parkingPaces Array
    let totalParkingSpacesLength = parkingSpaces.length;
    let carSlotFreed = 0;

    if(totalParkingSpacesLength != 0) {
        carSlotFreed = parkingSpaces.indexOf(carNumber);
        if(carSlotFreed != -1) {
            console.log('FREEING PARKINGSLOT: ' + carSlotFreed + ' for: ' + carNumber);
            parkingSpaces[carSlotFreed] = null;
        }
    }
    return carSlotFreed;

}


function computeParkingAmt(hoursParkedVal) {
    // Charge applicable is $10 for the first 2 hours and $10 for every additional hour.
    let totalAmt = 10;
    const firstTwoHrs = 2;
    const increment = 10;

    if(hoursParkedVal <= firstTwoHrs) {
        return totalAmt;
    } 

    for(let i = firstTwoHrs; i < hoursParkedVal ; i++) {
        totalAmt += increment;
    }

    //console.log(`hours: ${hoursParkedVal} total amount: ${totalAmt}`);
    return totalAmt;
}

function getStatus() {
    let statArr = new Array();
    let totalParkingSpacesLength = parkingSpaces.length;

    if(totalParkingSpacesLength != 0) {
        statArr.push('Slot No.  Registration No.');

        for(let i = 0; i < totalParkingSpacesLength; i++) {
            if(parkingSpaces[i] != null) {
                let slot = i + 1;
                statArr.push(`${slot}   ${parkingSpaces[i]}`);
            }
        }

        return statArr;
    }
}