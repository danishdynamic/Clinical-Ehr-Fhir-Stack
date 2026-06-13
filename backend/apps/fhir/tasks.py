import asyncio


async def generate_fhir_bundle(
    patient
):

    await asyncio.sleep(5)

    return {
        "status": "completed"
    }