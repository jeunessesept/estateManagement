function initModels(sequelize) {
    const {
        users,
        tokens,
        buildings,
        roles,
        rooms,
        charges,
        companies,
        includeCharges,
        excludeCharges,
        tenants,
        tenantFiles,
        userFiles,
        managerBuilding,
        ownerBuilding,
        specialConditions,
        archiveTenant
    } = sequelize.models


    // Define model associations 

    //----- specialConditions / tenants
    tenants.hasOne(specialConditions)
    specialConditions.belongsTo(tenants)


    //----- Building / rooms 
    buildings.hasMany(rooms, { onDelete: 'CASCADE' })
    rooms.belongsTo(buildings)

    //----- User / roles
    users.belongsToMany(roles, { through: 'userRole', foreignKey: 'userId' });
    roles.belongsToMany(users, { through: 'userRole', foreignKey: 'roleId' });

   
    //------- Users / Buildings 
    users.belongsToMany(buildings, { through: "managerBuilding", foreignKey: 'managerId', as: "managedBuildings" });
    users.belongsToMany(buildings, { through: "ownerBuilding", foreignKey: 'ownerId', as: "ownedBuildings" });

    buildings.belongsToMany(users, {through: "managerBuilding", foreignKey: 'buildingId', as: 'managers'});
    buildings.belongsToMany(users, {through: "ownerBuilding", foreignKey: 'buildingId', as: 'owners'});



    //----- Rooms / Charges 
    rooms.belongsToMany(charges, { through: 'chargesIncludeRooms', foreignKey: 'roomId', as: "typeOfIncCharges", onDelete: 'CASCADE' });
    charges.belongsToMany(rooms, { through: 'chargesIncludeRooms', foreignKey: 'chargeId', as: "typeOfIncRooms" })

    rooms.belongsToMany(charges, { through: 'chargesExcludeRooms', foreignKey: 'roomId', as: "typeOfExcCharges", onDelete: 'CASCADE' });
    charges.belongsToMany(rooms, { through: 'chargesExcludeRooms', foreignKey: 'chargeId', as: 'typeOfExcRooms' })

    //----- Tenant / Room
    rooms.belongsToMany(tenants, { through: 'tenantRoom', onDelete: 'CASCADE' });      // revoir association, belongsTo ?
    tenants.belongsToMany(rooms, { through: 'tenantRoom' });

    //----  Company / building
    companies.hasMany(buildings)
    buildings.belongsTo(companies)





    // sequelize.sync()
    // companies.sync({alter: true})
    // buildings.sync({alter: true})
    // users.sync({alter: true})
    // managerBuilding.sync({alter: true})
    // rooms.sync({alter: true})
    // specialConditions.sync()
    // tenants.sync({alter: true})

}

module.exports = { initModels }