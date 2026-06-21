from datetime import datetime
from apps.patients.models import Patient
from apps.observations.models import Observation
from .mappings import OPENEHR_FLAT_TEMPLATE_MAP

class OpenEHRFlatConverter:
    
    @staticmethod
    def create_vitals_composition(patient: Patient, observations: list[Observation]) -> dict:
        """
        Transforms a patient and an array of core database observations 
        into a valid, single openEHR FLAT JSON composition document.
        """
        # 1. Establish mandatory openEHR Reference Model context metadata
        composition = {
            "ctx/language": "en",
            "ctx/territory": "US",
            "ctx/composer_name": f"User_ID_{patient.created_by_id}",
            "ctx/time": datetime.now().isoformat(),
            "vitals_encounter/context/start_time": datetime.now().isoformat(),
            "vitals_encounter/context/setting|code": "238", # Generic ambulatory/telehealth setting code
            "vitals_encounter/context/setting|value": "other care",
        }
        
        # 2. Dynamically process and inject the observation vectors using our map
        for obs in observations:
            lookup_key = obs.code.lower().strip().replace(" ", "_")
            mapping = OPENEHR_FLAT_TEMPLATE_MAP.get(lookup_key)
            
            if mapping:
                # Map actual magnitude metrics and baseline engineering units
                composition[mapping["magnitude_path"]] = float(obs.value)
                composition[mapping["unit_path"]] = obs.unit or mapping["default_unit"]
                
                # Append point-in-time sequencing timestamps required by archetypes
                time_path = f"{mapping['template_prefix']}/time"
                composition[time_path] = obs.observed_at.isoformat()
                
        return composition