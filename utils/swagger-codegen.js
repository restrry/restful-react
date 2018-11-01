var fs = require("fs");
var path = require("path");
var CodeGen = require("swagger-typescript-codegen").CodeGen;
const { fix } = require("prettier-tslint");
const template = require("./template");

const entryPoints = [
  {
    file: "./swagger.json",
    fileName: "petShop.tsx",
  },
];

entryPoints.forEach(function(entryPoint) {
  const { file, fileName } = entryPoint;
  const swaggerPath = path.resolve(__dirname, file);
  var swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, "UTF-8"));

  const data = CodeGen.transformToViewData({ swagger: swaggerSpec });

  fs.writeFileSync(fileName, template(data));
  fix(fileName);
});
