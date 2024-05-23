import requests
import os
import time
id = 1
BASEURL = "http://localhost:5000/api"
iswindows = os.name == "nt"

def heartbeat():
    requests.post(f"{BASEURL}/heartbeat", json={"id": id}, timeout=5)

def getuptime():
    if iswindows:
        uptime = os.popen("powershell (get-date) - (gcim Win32_OperatingSystem).LastBootUpTime").read().strip().split("\n")[-1]
        uptime = uptime[20:]
        uptime = uptime.split(".")[0]
        print("uptime", uptime)
        requests.post(f"{BASEURL}/uptime", json={"id": id, "uptime": uptime}, timeout=5)
    else:
        return os.popen("uptime").read().strip()


def getload():
    if iswindows:
        load = os.popen("wmic cpu get loadpercentage").read().strip().split("\n")[-1]
        load = load.split(" ")[0]
        print("load", load)
        requests.post(f"{BASEURL}/load", json={"id": id, "load": load}, timeout=5)
    else:
        load = os.popen("uptime").read().strip().split("load average: ")[1].split(",")[0]
        requests.post(f"{BASEURL}/load", json={"id": id, "load": load}, timeout=5)



def memusage():
    """sends ram usage to server"""
    if iswindows:
        mem = os.popen("wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value").read().strip().split("\n")
        free = mem[0].split("=")[1]
        total = mem[2].split("=")[1]
        used = int(total) - int(free)
        usedpercent = round((used / int(total)) * 100)
        print("usedpercent", usedpercent)
        requests.post(f"{BASEURL}/memusage", json={"id": id,"memusage": usedpercent}, timeout=5)
    else:
        #TODO
        requests.post(f"{BASEURL}/memusage", json={"id": id, "usedpercent": 0}, timeout=5)


def diskusage():
    if iswindows:
        disk = os.popen("wmic logicaldisk get size,freespace,caption /Value").read().strip().split("\n")
        free = disk[2].split("=")[1]
        total = disk[4].split("=")[1]
        used = int(total) - int(free)
        usedpercent = round((used / int(total)) * 100)
        print("usedpercent", usedpercent)
        requests.post(f"{BASEURL}/diskusage", json={"id": id, "diskusage": usedpercent}, timeout=5)

def temp():
    if iswindows:
        #TODO
        requests.post(f"{BASEURL}/temp", json={"id": id, "temp": 0}, timeout=5)
    else:
        #TODO
        requests.post(f"{BASEURL}/temp", json={"id": id, "temp": 0}, timeout=5)

                                                                           
def main():
    while True:
        getuptime()
        getload()
        memusage()
        diskusage()
        time.sleep(10)
    


if __name__ == "__main__":
    main()

