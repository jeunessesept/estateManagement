const { createBuilding } = require('../controllers/buildings.controller');
const buildingService = require('../services/building.service');

// Mock the services
jest.mock('../services/building.service', () => ({
    createBuilding: jest.fn(),
  }));
  
  describe('Building Controllers', () => {
    it('should create a new building', async () => {
      // Mock the service function to return a building object
      const mockedBuilding = { id: 1, name: 'Mocked Building' };
      buildingService.createBuilding.mockResolvedValue(mockedBuilding);
  
      // Mock the request and response objects
      const req = {
        body: {
          buildingInfos: { name: 'Test Building' },
          ownersIds: [1, 2],
          managersIds: [3, 4],
          companyId: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mock the status function to return itself
        send: jest.fn(), // Mock the send function
      };
  
      // Call the controller function
      await createBuilding(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(201); // Expect status code 201
      expect(res.send).toHaveBeenCalledWith(mockedBuilding); // Expect the response to contain the mocked building data
    });
  });