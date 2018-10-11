var fs = require("fs");
var path = require("path");
var CodeGen = require("swagger-typescript-codegen").CodeGen;

const entryPoints = [
  {
    serviceName: false,
    file: "./swagger.json",
    fileName: "petShop.ts",
  },
];

entryPoints.forEach(function(entryPoint) {
  const { serviceName, file, fileName } = entryPoint;
  var swaggerPath = path.resolve(__dirname, file);
  var classTemplatePath = path.resolve(__dirname, "./templates/class.mustache");
  var methodTemplatePath = path.resolve(__dirname, "./templates/method.mustache");
  var typeTemplatePath = path.resolve(__dirname, "./templates/type.mustache");

  var swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, "UTF-8"));
  var tsSourceCode = CodeGen.getTypescriptCode({
    lint: false,
    beautify: false,
    className: "PetShopAPI",
    swagger: swaggerSpec,
    template: {
      class: fs.readFileSync(classTemplatePath, "utf-8"),
      method: fs.readFileSync(methodTemplatePath, "utf-8"),
      type: fs.readFileSync(typeTemplatePath, "utf-8"),
    },
  });

  fs.writeFileSync(fileName, tsSourceCode);
});
