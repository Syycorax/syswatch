import requests
import os
import time
from dotenv import load_dotenv
load_dotenv()
BASEURL = os.getenv("BASEURL")
id = os.getenv("ID")
iswindows = os.name == "nt"
password = os.getenv("PASSWORD")

def getuptime():
    """
    sends uptime in milliseconds to /uptime endpoint
    """
    if iswindows:
        uptime = os.popen("powershell (get-date) - (gcim Win32_OperatingSystem).LastBootUpTime").read().strip().split("\n")[-1]
        uptime = uptime[20:]
        uptime = uptime.split(".")[0]
        print("uptime", uptime)
    else:
        with open("/proc/uptime", "r", encoding="utf-8") as f:
            uptime = int(float(f.read().split(" ")[0]) * 1000)
            print("uptime", uptime)
    requests.post(f"{BASEURL}/uptime", json={"id": id, "uptime": uptime, "password": password}, timeout=5)


def getload():
    """
    sends cpu load to /load endpoint
    """
    if iswindows:
        load = os.popen("wmic cpu get loadpercentage").read().strip().split("\n")[-1]
        load = load.split(" ")[0]
    else:
        load = os.popen("uptime").read().strip().split("load average: ")[1].split(",")[0]
    requests.post(f"{BASEURL}/load", json={"id": id, "load": load, "password": password}, timeout=5)



def memusage():
    """sends memory usage to /memusage endpoint"""
    if iswindows:
        mem = os.popen("wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value").read().strip().split("\n")
        free = mem[0].split("=")[1]
        total = mem[2].split("=")[1]
        used = int(total) - int(free)
        usedpercent = round((used / int(total)) * 100)
        print("usedpercent", usedpercent)
    else:
        with open("/proc/meminfo", "r", encoding="utf-8") as f:
            mem = f.read().split("\n")
            total = int(mem[0].split(" ")[-2])
            free = int(mem[2].split(" ")[-2])
            used = total - free
            usedpercent = round((used / total) * 100)
    requests.post(f"{BASEURL}/memusage", json={"id": id, "memusage":usedpercent, "password": password}, timeout=5)


def diskusage():
    """sends disk usage to /diskusage endpoint"""
    if iswindows:
        disk = os.popen("wmic logicaldisk get size,freespace,caption /Value").read().strip().split("\n")
        free = disk[2].split("=")[1]
        total = disk[4].split("=")[1]
        used = int(total) - int(free)
        usedpercent = round((used / int(total)) * 100)
        print("usedpercent", usedpercent)
    else:
        usedpercent = os.popen("df -h /").read().strip().split("\n")[1].split(" ")[9][:-1]
    requests.post(f"{BASEURL}/diskusage", json={"id": id, "diskusage": usedpercent, "password": password}, timeout=5)

def temp():
    """sends temperature to /temp endpoint"""
    if iswindows:
        #TODO find a way to get temp without admin rights
        t = 0
    else:
        with open("/sys/class/thermal/thermal_zone0/temp", "r", encoding="utf-8") as f:
            t = f.read().strip()
            t = int(t) / 1000
            t = int(t)
            print("temp", t)
    requests.post(f"{BASEURL}/temp", json={"id": id, "temp": t, "password": password}, timeout=5)

def userstring():
    """sends userstring to /userstring endpoint"""
    if iswindows:
        user = os.popen("whoami").read().strip().split("\\")[-1]
        machine = os.popen("hostname").read().strip()
        userstring = f"{user}@{machine}"
        print("userstring", userstring)
    else:
        userstring = os.popen("whoami").read().strip()
    requests.post(f"{BASEURL}/user", json={"id": id, "userstring": userstring, "password": password}, timeout=5)


def main():
    userstring()
    while True:
        getuptime()
        getload()
        memusage()
        diskusage()
        temp()
        time.sleep(10)
    


if __name__ == "__main__":
    main()

