/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('jobs.indexer');
 * mod.thing == 'a thing'; // true
 */

var HarvesterDrone =
{
    DoTask: function(Controller, Drone)
    {
        if(Drone == null)
        {
            console.log("Null drone passed to HarvesterDrone Object");
            return;
        }

        if (Drone.memory.JobState == null)
        {
            Drone.memory.JobState = "Harvest";
        }
        
        if (Drone.memory.JobState == "Harvest")
        {
            //Is this drone at full carry capacity from harvesting
            if (_.sum(Drone.carry) == Drone.carryCapacity) 
            {
                Drone.memory.JobState = "Deposit";
            }
            else
            {
                var source = Controller.RoomController.GetController("ResourceController").GetSource();
                if (Drone.harvest(source) == ERR_NOT_IN_RANGE)
                {
                    Drone.moveTo(source);
                    return;
                }
            }

        }

        if(Drone.memory.JobState == "Deposit")
        {
            //Is this drone out of energy
            if (_.sum(Drone.carry) == 0)
            {
                Drone.memory.JobState = "Harvest";
                return;
            }

            //If not get a deposit target from the ResourceController
            var DepositTarget  = Controller.RoomController.GetController("ResourceController").GetDepositTarget();

            if(DepositTarget.structureType == "controller")
            {
                if(Drone.upgradeController(DepositTarget) == ERR_NOT_IN_RANGE)
                {
                    Drone.moveTo(DepositTarget);
                }
            }
            else
            {
                if(Drone.transfer(DepositTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    Drone.moveTo(DepositTarget);
                }
            }
        }
    }
};

module.exports = HarvesterDrone;