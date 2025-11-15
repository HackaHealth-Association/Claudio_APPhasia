module.exports = {
  "name": "BodyPart",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the body part"
    },
    "category": {
      "type": "string",
      "enum": [
        "upper_body",
        "lower_body",
        "head",
        "torso"
      ],
      "description": "Category of the body part"
    },
    "display_order": {
      "type": "number",
      "description": "Order for display"
    }
  },
  "required": [
    "name",
    "category"
  ]
};