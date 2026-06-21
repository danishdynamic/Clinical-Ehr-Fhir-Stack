# apps/openehr/mappings.py

# This layout mirrors standard openEHR FLAT format compositions 
# based on a hypothetical unified 'Vitals Encounter' operational template (OPT) later we can use ehr base in docker to generate real template paths and mappings
OPENEHR_FLAT_TEMPLATE_MAP = {
    "heart_rate": {
        "template_prefix": "vitals_encounter/vitals/pulse:0/rate",
        "magnitude_path": "vitals_encounter/vitals/pulse:0/rate|magnitude",
        "unit_path": "vitals_encounter/vitals/pulse:0/rate|unit",
        "default_unit": "/min",
    },
    "blood_pressure": {
        "template_prefix": "vitals_encounter/vitals/blood_pressure:0/systolic",
        "magnitude_path": "vitals_encounter/vitals/blood_pressure:0/systolic|magnitude",
        "unit_path": "vitals_encounter/vitals/blood_pressure:0/systolic|unit",
        "default_unit": "mmHg",
    },
    "temperature": {
        "template_prefix": "vitals_encounter/vitals/body_temperature:0/temperature",
        "magnitude_path": "vitals_encounter/vitals/body_temperature:0/temperature|magnitude",
        "unit_path": "vitals_encounter/vitals/body_temperature:0/temperature|unit",
        "default_unit": "Cel",
    }
}