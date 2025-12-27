from pydantic import BaseModel
from typing import List

class BusFactorMetric(BaseModel):
    process_id: str
    process_name: str
    bus_factor: int
    critical_people: List[str]

class DashboardMetrics(BaseModel):
    total_processes: int
    critical_processes_count: int
    bus_factor_map: List[BusFactorMetric]
