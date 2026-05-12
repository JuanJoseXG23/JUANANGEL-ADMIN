export const letterVariables = [
  "{{nombre}}",
  "{{cedula}}",
  "{{expedicion}}",
  "{{cargo}}",
  "{{tipoContrato}}",
  "{{fechaIngreso}}",
  "{{salario}}",
  "{{fechaActual}}",
];

export const standardLaborLetter = {
  nombrePlantilla: "Carta laboral estándar",
  contenido: `A QUIEN PUEDA INTERESAR

Certifico que la señora {{nombre}}, identificada con cédula de ciudadanía No. {{cedula}} de {{expedicion}}, labora para esta empresa desde el {{fechaIngreso}}, tiene firmado un contrato a término {{tipoContrato}}, se desempeña como {{cargo}}, devenga un salario mensual de {{salario}} más auxilio de transporte.

Se expide la presente certificación a solicitud de la interesada.

Cualquier información adicional puede solicitarla.

3104879268`,
};
