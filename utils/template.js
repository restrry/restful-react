function generateProperty(property) {
  return `${property.name}${property.isRequired ? "?" : ""}: ${generateType(property)}`;
}
function generateType(type) {
  if (!type) return "any";
  if (type.isRef) return type.target;
  if (type.isAtomic) return type.tsType;
  if (type.isEnum) return type.tsType;
  if (type.isArray) return `Array<${generateType(type.elementType)}>`;
  if (type.isObject) return `{ ${type.properties.map(generateProperty)} }`;
  if (type.isDictionary) return `{[name: string]: ${generateType(type.elementType)}}`;

  return type.tsType || type;
}

function generateDefinitions(definitions) {
  return definitions.map(d => `interface ${d.name} ${generateType(d.tsType)}`).join("\n\n");
}
function generateMethods(methods) {
  return methods
    .map(
      m => `
export type I${m.methodName}Props = Omit<${m.isGET ? "GetProps" : "MutateProps"}<${
        m.successfulResponseType
      }, any>, 'path'>;

export const ${m.methodName}: React.SFC<I${m.methodName}Props> = (props: I${m.methodName}Props) => (<${
        m.isGET ? "Get" : `Mutate verb="${m.method}"`
      } path="${m.path}">
    {props.children}
  </${m.isGET ? "Get" : "Mutate"}>
)`,
    )
    .join("\n");
}

module.exports = function(data, additionalData) {
  return `
import * as React from "react";
import {
    Get,
    GetProps,
    Mutate,
    MutateProps
} from "restful-react";
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

${generateDefinitions(data.definitions)}
${generateMethods(data.methods)}
`;
};
