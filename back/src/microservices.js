module.exports = {
  applyEndpoints: (microserviceEndpoints, microserviceApp) => {
    for (const endpoint of microserviceEndpoints) {
      microserviceApp[endpoint.method.toLowerCase()](
        endpoint.paths,
        async (req, res, next) => {
          try {
            return await endpoint.handler(req, res, next);
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.json({ message: e.message, stack: e.stack });
          }
        }
      );
    }
  },

  applyMicroservices: (
    mainApp,
    microserviceNameList,
    microserviceEndpointsList
  ) => {
    let i = 0;
    for (const microserviceEndpoints of microserviceEndpointsList) {
      for (const method of ["get", "post", "put", "delete"]) {
        const methodEndpointList = microserviceEndpoints.reduce(
          (array, value) => {
            const newArray = array;
            if (value.method.toLowerCase() == method) {
              newArray.push(...value.paths);
            }
            return newArray;
          },
          []
        );
        if (methodEndpointList.length > 0) {
          const microserviceName = microserviceNameList[i];
          mainApp[method](methodEndpointList, async (req, res, next) => {
            await res.delegate(microserviceName);
          });
        }
      }
      i++;
    }
  },
};
