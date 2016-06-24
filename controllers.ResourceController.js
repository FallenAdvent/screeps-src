/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('jobs.indexer');
 * mod.thing == 'a thing'; // true
 */


var ResourceController =
{
    Name: "ResourceController",
    Sources: [],
    DepositTargets: [],
    BuildTargets: [],
    RepairTargets: [],
    HostileTargets: [],
    LoadMem: function(RoomControllerData)
    {
        //Clear out the lists since they may hold values from differnt rooms
        this.Sources = [];//RoomControllerData[this.Name].Sources;
        this.DepositTargets = [];
        this.BuildTargets = [];
        this.RepairTargets = [];
        this.HostileTargets = [];
    },
    SaveMem: function(RoomControllerData)
    {
        //RoomControllerData[this.Name].Sources = this.Sources;
    },
    Manage: function(RoomController)
    {

        //Get Room Energy Sources
        var srcs = RoomController.Room.find(FIND_SOURCES)
        for (var i in srcs)
        {
            this.Sources.push({ Source: srcs[i], DroneCount: 0 });
        }


        //Get all the strucutres and find any that need repair
        var Structures = RoomController.Room.find(FIND_STRUCTURES);
        for(var i in Structures)
        {
            var structure = Structures[i];
            //Does the structure need repair
            if(structure.hits < structure.hitsMax)
            {
                this.RepairTargets.push({ Target: structure, DroneCount: 0 });
            }

            if (structure.structureType == "extension")
            {
                //We also only add extenstion when then need to be filled
                if (structure.energy < structure.energyCapacity)
                {
                    this.DepositTargets.push({ Target: structure, DroneCount: 0 });
                }
            }

            if (structure.structureType == "controller") {
                //add the controller at all times since we allways want it avlaible for energy transfer
                this.DepositTargets.push({ Target: structure, DroneCount: 0 });
            }
            if (structure.structureType == "spawn")
            {
                //We only add spawn to the list when it not full of energy
                if (structure.energy < structure.energyCapacity)
                {
                    //Insert the spawn structures at the begining of the arry to ensure they get filled
                    if (this.DepositTargets.length != 0) {
                        this.DepositTargets.unshift({ Target: structure, DroneCount: 0 });
                    }
                    else
                    {
                        this.DepositTargets.push({ Target: structure, DroneCount: 0 });
                    }
                }

            }
            //TODO Add something about energy storage systems at some point
        }

        this.RepairTargets.sort(function (a, b) { if (a.hitsMax < b.hitsMax) return a; else { return b; } });

        var constructionSites = RoomController.Room.find(FIND_CONSTRUCTION_SITES);
        for(var i in constructionSites)
        {
            this.BuildTargets.push({ Target: constructionSites[i], DroneCount: 0 });
        }



        //TODO Add search for hostiles
    },
    GetRepairTarget: function ()
    {
        var ret = this.RepairTargets[0];
        if (ret == null) return null;

        for(var i in this.RepairTargets)
        {
            if(this.RepairTargets[i].DroneCount < ret.DroneCount)
            {
                ret = this.RepairTargets[i];
            }
        }
        ret.DroneCount++;
        return ret.Target;
    },
    GetDepositTarget: function ()
    {
        var ret = this.DepositTargets[0];
        //In thereoy the below should never occur as there is allways a controller but for saintys sake we check anyways
        if (ret == null) return null;

        for(var i in this.DepositTargets)
        {
            if (this.DepositTargets[i].Target.structureType == "spawn" || this.DepositTargets[i].Target.structureType == "extension") {
                if (ret.DroneCount > this.DepositTargets[i].DroneCount - 1) {
                    ret = this.DepositTargets[i];
                }
            }
            else {
                if (ret.DroneCount > this.DepositTargets[i].DroneCount) {
                    ret = this.DepositTargets[i];
                }
            }
        }
        ret.DroneCount++;
        return ret.Target;
    },
    GetSource: function()
    {
        var ret = this.Sources[0];
        if (ret == null) return null;
 
        for (var i in this.Sources)
        {
            if (ret.DroneCount > this.Sources[i].DroneCount)
            {
                    ret = this.Sources[i];
            }
        }

        ret.DroneCount++;
        return ret.Source;
    },
    GetSourceClosetTo:function(Creep)
    {
        var ret = this.Sources[0];
        var distance = Creep.pos.getRangeTo(ret.Source);

        for(var i in this.Sources)
        {
            var distance2 = Creep.pos.getRangeTo(this.Sources[i].Source);
            if(distance2 < distance)
            {
                ret = this.Sources[i];
            }
        }

        ret.DroneCount++;
        return ret.Source;
    },
    GetBuildTarget: function()
    {
        var ret = this.BuildTargets[0];
        if (ret == null) return null;

        for (var i in this.BuildTargets)
        {
            if (ret.DroneCount > this.BuildTargets[i].DroneCount)
            {
                ret = this.BuildTargets[i];
            }
        }
        ret.DroneCount++;
        return ret.Target;
    },
    GetHostileTargets: function ()
    {
        //Not implmented yet
    }
};

module.exports = ResourceController;