/**
 * Workstation DTO for hardware and OS details.
 */
export type ClientWorkstation = {
  networkSegment: string;
  workstationName: string;
  netbiosName: string;
  userDomain: string;
  computerDomain: string;
  username: string;
  manufacturer: string;
  model: string;
  biosSerial: string;
  os: string;
  osVersion: string;
  osInstallDate: string;
  osDirectory: string;
  cpu: string;
  cpuFrequencyMhz: string;
  ramMb: string;
  hddGb: string;
  macAddress: string;
  ipAddress: string;
  ipGateway: string;
  heartbeat: string;
  location: string;
  biosPasswordStatus: string;
  ou: string;
};
