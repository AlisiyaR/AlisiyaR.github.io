// הדמיה של checker.sh, vulner.sh ו-ghostlogin.sh: אותן פונקציות, אותו פלט.
// אין כאן שום בקשת רשת. כל התוצאות מגיעות מ-network.js.
// t = המסוף: t.echo(שורות), await t.read(שאלה), await t.sleep(שניות)
(() => {
  const L39 = "-".repeat(39), L62 = "-".repeat(62), E39 = "=".repeat(39);
  const strip = s => s.replace(/\s/g, "");
  const isNumber = s => /^\+?\d{1,18}$/.test(s);
  const yes = s => s === "y" || s === "Y";
  const no = s => s === "n" || s === "N";
  const pick = list => list[Math.floor(Math.random() * list.length)];

  // השעון של המכונה במעבדה (שעון מזרח ארה"ב, כמו בצילומים)
  function clock() {
    const parts = {};
    for (const p of new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", weekday: "short", month: "short", day: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZoneName: "short"
    }).formatToParts(new Date())) parts[p.type] = p.value;
    return parts;
  }
  function date() {
    const p = clock();
    return `${p.weekday} ${p.month} ${p.day.replace(/^0/, " ")} ${p.hour}:${p.minute}:${p.second} ${p.dayPeriod} ${p.timeZoneName} ${p.year}`;
  }
  function nmapTime() {
    const p = clock(), month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(p.month) / 3 + 1;
    const hour = Number(p.hour) % 12 + (p.dayPeriod === "PM" ? 12 : 0);
    const two = n => String(n).padStart(2, "0");
    return `${p.year}-${two(month)}-${p.day} ${two(hour)}:${p.minute} ${p.timeZoneName === "EDT" ? "-0400" : "-0500"}`;
  }

  async function dependencies(t, tools) {
    t.echo("Verifying that required tools are installed...");
    await t.sleep(1);
    for (const tool of tools) t.echo(`[+] Found ${tool}`);
    t.echo("");
  }
  async function checkRoot(t, root, script) {
    t.echo("Checking script permissions...");
    await t.sleep(1);
    if (!root) {
      t.echo("ERROR - please run this script with sudo/root permissions.", `Example: sudo bash ${script}`);
      return false;
    }
    t.echo("Root permissions - VALID", "");
    return true;
  }

  /* ---------- CHECKER ---------- */
  const checkerLog = [];

  async function checker(t, root) {
    const net = LAB.checker, targets = Object.keys(net.hosts), logFile = "/var/log/checker.log";
    const history = [], reports = [];
    const range = net.localIp.split(".").slice(0, 3).join(".") + ".0/24";

    function writeLog(attack, target) {
      const line = `${date()} | Attack: ${attack} | Target IP: ${target}`;
      checkerLog.push(line);
      history.push(line);
    }
    const summary = () => t.echo("The full summary will appear in the FINAL SESSION REPORT.", L62);

    async function portScan(target) {
      const name = "Port Scan", open = net.hosts[target].tcp;
      t.echo(`Starting Port Scan attack on: ${target}`, "Scanning the target for the top 200 common TCP ports using Nmap.", "");
      await t.sleep(3);
      t.echo("", "Port Scan completed.");
      summary();
      reports.push([`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Reconnaissance", "Scan Type: TCP Port Scan",
        "Ports Scanned: Top 200 TCP ports", `Result: ${open.length ? "Open TCP ports were found." : "No open TCP ports were found."}`,
        ...(open.length ? ["", "Open Ports:", ...open] : [])]);
      writeLog(name, target);
    }
    async function udpScan(target) {
      const name = "UDP Scan", open = net.hosts[target].udp;
      t.echo(`Starting UDP Scan attack on: ${target}`, "Scanning the target for common UDP ports using Nmap.", "");
      await t.sleep(3);
      t.echo("", "UDP Scan completed.");
      summary();
      reports.push([`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Reconnaissance", "Scan Type: UDP Port Scan",
        "Ports Scanned: Top 20 UDP ports", `Result: ${open.length ? "Open UDP ports were found." : "No open UDP ports were found."}`,
        ...(open.length ? ["", "Open UDP Ports:", ...open] : [])]);
      writeLog(name, target);
    }
    async function sshWeakCredentials(target) {
      const name = "SSH Weak Credentials", passwords = net.hosts[target].passwords;
      t.echo(`Starting SSH Weak Credentials attack on: ${target}`, "Checking local users for weak SSH passwords using Hydra.", "");
      await t.sleep(2);
      if (!net.hosts[target].tcp.some(l => l.startsWith("22/tcp open"))) {
        const result = `SSH port 22 is not open on ${target}. Skipping Hydra test.`;
        t.echo(result);
        reports.push([`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Credential Attack", "SSH Status: Closed", `Result: ${result}`]);
        writeLog(name, target);
        return;
      }
      t.echo("Users selected for Hydra test:", L62, ...LAB.users.map(u => `[-] ${u}`), L62, "");
      const results = [];
      let found = false;
      for (const user of LAB.users) {
        t.echo(`Checking username: ${user}`);
        await t.sleep(3);
        const password = passwords[user];
        if (password) found = true;
        results.push(`Username: ${user}`, `Password: ${password || "Not found"}`, `Status: ${password ? "FOUND" : "NOT FOUND"}`, L39);
      }
      t.echo("", "SSH Weak Credentials check completed.");
      summary();
      reports.push([`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Credential Attack", "SSH Status: Open", "", "Users Tested:",
        ...LAB.users, "", `Result: ${found ? "Weak SSH credentials were found." : "No weak SSH credentials were found."}`, "",
        "Credentials Check:", L39, ...results]);
      writeLog(name, target);
    }
    async function synFlood(target) {
      const name = "SYN Flood";
      t.echo(`Starting SYN Flood attack on: ${target}`, "Sending a controlled burst of TCP SYN packets using Hping3.", "");
      await t.sleep(3);
      t.echo("", "SYN Flood completed.");
      summary();
      reports.push([`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Denial of Service", "Target Port: TCP 80", "Packets Sent: 1000",
        "Result: Controlled SYN flood simulation completed."]);
      writeLog(name, target);
    }
    async function arpSpoof(target) {
      const name = "ARP Spoofing", head = [`Attack: ${name}`, `Target IP: ${target}`, "Attack Class: Man in the Middle"];
      t.echo(`Starting ARP Spoofing attack on: ${target}`, "Performing a controlled Man in the Middle attack using Arpspoof.", "");
      await t.sleep(1);
      if (target === net.localIp) {
        t.echo("ERROR - the selected target is the local machine.");
        reports.push([...head, "Result: Attack was skipped because the selected target is the local machine."]);
        writeLog(name, target);
        return;
      }
      if (target === net.gateway) {
        t.echo("ERROR - the selected target is the default gateway.");
        reports.push([...head, "Result: Attack was skipped because the selected target is the default gateway."]);
        writeLog(name, target);
        return;
      }
      t.echo(`Network interface: ${net.iface}`, `Gateway IP: ${net.gateway}`, "");
      await t.sleep(5);
      t.echo("", "ARP Spoofing completed.");
      summary();
      reports.push([...head, `Gateway IP: ${net.gateway}`, `Network Interface: ${net.iface}`, "Result: Controlled ARP spoofing simulation completed."]);
      writeLog(name, target);
    }

    async function chooseTarget() {
      t.echo("Choose a target IP address:", L62);
      const last = targets.length + 1;
      targets.forEach((h, i) => t.echo(`${i + 1}) ${h}`));
      t.echo(`${last}) Random Target`, "");
      const choice = strip(await t.read(`Choose target number 1-${last}: `));
      if (!isNumber(choice) || Number(choice) < 1 || Number(choice) > last) {
        t.echo("ERROR - invalid target choice.", "Program terminated.");
        return null;
      }
      let target;
      if (Number(choice) === last) {
        target = pick(targets);
        t.echo(`Random target selected - ${target}`);
      } else {
        target = targets[choice - 1];
        t.echo(`Selected target IP - ${target}`);
      }
      t.echo("");
      return target;
    }
    async function chooseAttack() {
      t.echo("Available attacks:", L62,
        "1) Port Scan - scans the target for the top 200 common TCP ports using Nmap.",
        "2) UDP Scan - scans common UDP ports using Nmap.",
        "3) SSH Weak Credentials - checks for weak SSH passwords using Hydra.",
        "4) SYN Flood - sends multiple TCP SYN packets using Hping3.",
        "5) ARP Spoofing - performs a controlled Man in the Middle attack using Arpspoof.",
        "6) Random Attack - chooses one attack randomly from the list.", "");
      let choice = strip(await t.read("Choose attack number 1-6: "));
      if (!isNumber(choice) || Number(choice) < 1 || Number(choice) > 6) {
        t.echo("ERROR - invalid attack choice.", "Program terminated.");
        return null;
      }
      choice = Number(choice);
      if (choice === 6) {
        choice = pick([1, 2, 3, 4, 5]);
        t.echo(`Random attack selected - attack number ${choice}`);
      }
      t.echo("");
      return choice;
    }

    t.echo(L39, "     SOC ANALYST | PROJECT: CHECKER", L39, "");
    await t.sleep(1);
    if (!await checkRoot(t, root, "checker.sh")) return;
    await dependencies(t, ["nmap", "hydra", "hping3", "arpspoof"]);
    t.echo("Preparing log file...");
    await t.sleep(1);
    t.echo(`Log file is ready - ${logFile}`, "", "Finding local network range...");
    await t.sleep(1);
    t.echo(`Local IP is - ${net.localIp}`, `Network range is - ${range}`, "",
      "Scanning for available IP addresses on the network...", `Network range to scan - ${range}`);
    await t.sleep(1);
    t.echo("");
    await t.sleep(2);
    t.echo("Network scan completed.", `${targets.length} available IP addresses were found.`, "");

    const attacks = [portScan, udpScan, sshWeakCredentials, synFlood, arpSpoof];
    for (;;) {
      const target = await chooseTarget();
      if (!target) return;
      const attack = await chooseAttack();
      if (!attack) return;
      await attacks[attack - 1](target);
      t.echo("");
      if (!yes(await t.read("Do you want to run another attack? (y/n): "))) break;
      t.echo("");
    }

    t.echo("", E39, "         FINAL SESSION REPORT", E39, "", "Available IP addresses detected:", L39, ...targets.map(h => `[-] ${h}`),
      "", "Executed attacks:", L39, ...history.map(h => `[-] ${h}`), "", "Detailed attack results:", L39,
      ...reports.flatMap(r => [...r, L39]), "", `Log file location: ${logFile}`, E39, "      CHECKER Assessment Complete", E39);
  }

  /* ---------- VULNER ---------- */
  // התיקיות וקובצי ה-Zip קיימים רק בזיכרון של הדף
  const dirs = new Set(LAB.vulner.existingDirs), zips = new Set();

  async function vulner(t, root) {
    const net = LAB.vulner, targets = Object.keys(net.hosts);
    const localNetwork = net.localIp.split(".").slice(0, 3).join(".");
    let range, directory, mode, results = [];
    const save = (...lines) => results.push(...lines);

    async function getRange() {
      t.echo("Finding local IP address...");
      await t.sleep(1);
      t.echo(`Local IP address - ${net.localIp}`, `Local network - ${localNetwork}.0/24`, "");
      for (;;) {
        const entered = strip(await t.read(`Enter a network range to scan (example: ${localNetwork}.0/24): `));
        const slash = entered.indexOf("/"), ip = slash < 0 ? entered : entered.slice(0, slash), cidr = slash < 0 ? "" : entered.slice(slash + 1);
        const octets = ip.split(".");
        if (octets.length !== 4 || !octets.every(o => isNumber(o) && Number(o) <= 255)) {
          t.echo("ERROR - invalid IPv4 address.", "");
          continue;
        }
        if (cidr !== "24") {
          t.echo("ERROR - please enter a /24 local network.", "");
          continue;
        }
        if (octets.slice(0, 3).join(".") !== localNetwork) {
          t.echo("ERROR - the entered network does not match the local network.", "Please enter a valid local /24 network range.", "");
          continue;
        }
        range = `${localNetwork}.0/24`;
        break;
      }
      t.echo("", `Selected network range - ${range}`, "");
    }
    async function getDirectory() {
      for (;;) {
        directory = strip(await t.read("Enter a name for the output directory: "));
        t.echo("Validating output directory name...");
        await t.sleep(1);
        if (!directory) {
          t.echo("Output directory name - INVALID", "Please enter a directory name.", "");
          continue;
        }
        if (/[^a-zA-Z0-9_-]/.test(directory)) {
          t.echo("Output directory name - INVALID", "Use only letters, numbers, underscore or hyphen.", "");
          continue;
        }
        const saved = `Results will be saved in - ${directory}/results.txt`;
        if (dirs.has(directory)) {
          t.echo("Output directory already exists.", "1) Overwrite the existing results file", "2) Enter another directory name", "");
          const choice = await t.read("Choose option 1-2: ");
          if (choice === "1") {
            t.echo("", "Existing results file was overwritten.", saved, "");
            return;
          }
          if (choice === "2") t.echo("");
          else t.echo("ERROR - invalid choice.", "Please choose option 1 or 2.", "");
          continue;
        }
        dirs.add(directory);
        t.echo("Output directory - VALID", saved, "");
        return;
      }
    }
    async function chooseMode() {
      for (;;) {
        t.echo("Choose scan mode:", L39, "1) Basic - TCP, UDP, service versions and weak credentials.",
          "2) Full - Basic scan, NSE and Searchsploit vulnerability mapping.", "");
        const choice = strip(await t.read("Choose scan mode 1-2: "));
        mode = { 1: "Basic", 2: "Full" }[choice];
        if (mode) break;
        t.echo("ERROR - invalid scan mode choice.", "");
      }
      t.echo(`Selected scan mode - ${mode}`, "");
    }
    async function choosePasswords() {
      for (;;) {
        t.echo("Choose password list:", L39, "1) Use the built-in password.lst file.", "2) Use my own password list file.", "");
        const choice = strip(await t.read("Choose password list 1-2: "));
        if (choice === "1") {
          t.echo("Built-in password.lst file selected.");
          break;
        }
        if (choice === "2") {
          if (await t.read("Enter the full path to your password list file: ") === net.customList) {
            t.echo("Personal password list selected.");
            break;
          }
          t.echo("ERROR - the selected password list is not valid.", "");
        } else t.echo("ERROR - invalid password list choice.", "");
      }
      t.echo("");
    }

    const nmap = (ip, scan, gap) => [`Starting Nmap 7.98 ( https://nmap.org ) at ${nmapTime()}`, `Nmap scan report for ${ip}`,
      `Host is up ${scan.up}.`, ...(gap ? [""] : []), ...scan.lines, "",
      "Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .",
      `Nmap done: 1 IP address (1 host up) scanned in ${scan.time} seconds`, ""];

    async function scanTarget(ip) {
      const host = net.hosts[ip];
      save(E39, `TARGET IP: ${ip}`, E39, "");
      t.echo(`[Stage 1] Running TCP scan on: ${ip}`);
      await t.sleep(2);
      save("TCP SCAN RESULTS", L39, ...nmap(ip, host.tcp));
      t.echo(`TCP scan completed for ${ip}.`, "", `[Stage 2] Running UDP scan on: ${ip}`);
      await t.sleep(2);
      save("UDP SCAN RESULTS", L39, ...nmap(ip, host.udp, true));
      t.echo(`UDP scan completed for ${ip}.`, "", `[Stage 3] Checking login services on: ${ip}`);

      save("WEAK CREDENTIALS RESULTS", L39);
      for (const [service, port] of [["SSH", 22], ["FTP", 21], ["TELNET", 23], ["RDP", 3389]]) {
        if (!host.tcp.lines.some(l => l.startsWith(`${port}/tcp open`))) {
          save(`${service} port ${port} is closed - credential check skipped.`, "");
          continue;
        }
        t.echo(`Checking ${service} weak credentials on: ${ip}`);
        save(`Service: ${service}`, `Port: ${port}`, L39);
        for (const user of LAB.users) {
          t.echo(`Checking username: ${user}`);
          await t.sleep(2);
          const password = host.passwords[user];
          save(`Username: ${user}`, `Password: ${password || "Not found"}`, `Status: ${password ? "FOUND" : "NOT FOUND"}`, "");
        }
        t.echo(`${service} weak credentials check completed for ${ip}.`, "");
      }
      t.echo(`Login services check completed for ${ip}.`, "");

      if (mode !== "Full") {
        save("VULNERABILITY MAPPING", L39, "Not executed - Basic scan mode was selected.", "");
        return;
      }
      t.echo(`[Stage 4] Running NSE vulnerability scan on: ${ip}`);
      await t.sleep(2);
      save("NSE VULNERABILITY RESULTS", L39, ...nmap(ip, host.nse));
      t.echo(`NSE vulnerability scan completed for ${ip}.`, "", `[Stage 5] Running Searchsploit analysis on: ${ip}`);
      await t.sleep(1);
      save("SEARCHSPLOIT RESULTS", L39);
      const services = host.tcp.lines.filter(l => l.includes("/tcp") && l.includes("open"));
      if (!services.length) {
        save("No open TCP services were found for Searchsploit analysis.", "");
        return; // כמו בסקריפט: יציאה בלי הודעת סיום
      }
      for (const line of services)
        save(`Searching for: ${line.split(/\s+/)[2]} ${line.split(" ").slice(3).join(" ")}`, "Exploits: No Results", "Shellcodes: No Results", "");
      save("");
      t.echo(`Searchsploit analysis completed for ${ip}.`, "");
    }

    async function search() {
      for (;;) {
        t.echo("");
        const choice = await t.read("Would you like to search inside the results? (y/n): ");
        if (no(choice)) return;
        if (!yes(choice)) {
          t.echo("ERROR - enter y or n.");
          continue;
        }
        const value = await t.read("Enter a word or sentence to search: ");
        if (!value) {
          t.echo("ERROR - search value cannot be empty.");
          continue;
        }
        let target = "General Results", found = false;
        t.echo("", "SEARCH RESULTS", L39);
        for (const line of results) {
          if (line.startsWith("TARGET IP:")) target = strip(line.split(":")[1]);
          if (line.toLowerCase().includes(value.toLowerCase())) {
            t.echo(`Target IP: ${target}`, `Result: ${line}`, "");
            found = true;
          }
        }
        t.echo(found ? "Search completed." : "No matching results were found.");
      }
    }
    async function zip() {
      for (;;) {
        t.echo("");
        const choice = await t.read("Would you like to save all results into a Zip file? (y/n): ");
        if (yes(choice)) {
          zips.add(`${directory}.zip`);
          t.echo(`Zip file created successfully - ${directory}.zip`);
          return;
        }
        if (no(choice)) {
          t.echo("Zip file was not created.");
          return;
        }
        t.echo("ERROR - enter y or n.");
      }
    }

    t.echo(L39, " PENETRATION TESTING | PROJECT: VULNER", L39, "");
    await t.sleep(1);
    if (!await checkRoot(t, root, "vulner.sh")) return;
    await dependencies(t, ["nmap", "hydra", "zip"]);
    await getRange();
    await getDirectory();
    await chooseMode();
    if (mode === "Full") t.echo("[+] Found searchsploit", "");
    await choosePasswords();
    t.echo("Collecting local usernames from the operating system...");
    await t.sleep(1);
    t.echo("Usernames selected for weak credentials checks:", L39, ...LAB.users.map(u => `[-] ${u}`), "");
    save(E39, "VULNER - PENETRATION TESTING REPORT", E39, `Date: ${date()}`, `Network: ${range}`, `Scan Mode: ${mode}`,
      `Output Directory: ${directory}`, E39, "");
    t.echo("Scanning the network for active IP addresses...", `Network range to scan - ${range}`);
    await t.sleep(3);
    t.echo("Network scan completed.", `${targets.length} active IP addresses were found.`, "", "Active IP addresses:", L39, ...targets, "");
    save("ACTIVE IP ADDRESSES", L39, ...targets, "");
    for (const ip of targets) {
      t.echo(E39, `Starting security checks for: ${ip}`, E39, "");
      await scanTarget(ip);
    }
    save("", "FINAL SUMMARY", L39, `Network Scanned: ${range}`, `Scan Mode: ${mode}`, `Active IP Addresses Found: ${targets.length}`,
      `Results File: ${directory}/results.txt`, "", "VULNER Assessment Complete");
    t.echo("", ...results);
    await search();
    await zip();
  }

  /* ---------- GhostLogin ---------- */
  async function ghostlogin(t) {
    const net = LAB.ghostlogin;
    t.echo(L39, "        GhostLogin - SSH Scanner       ", L39, "");
    await t.sleep(1);
    await dependencies(t, ["hydra", "nmap", "sshpass"]);
    t.echo("Fetching your local IP...");
    await t.sleep(1);
    t.echo(`Your local IP is - ${net.localIp}`, "");
    let mask;
    for (;;) {
      mask = strip(await t.read("Enter a subnet mask between 16-32 (Recommended 24): "));
      t.echo("Validating subnet mask value...");
      await t.sleep(1);
      if (isNumber(mask) && Number(mask) >= 16 && Number(mask) <= 32) {
        t.echo("Subnet mask - VALID", "");
        break;
      }
      t.echo("Subnet mask - INVALID", "");
      await t.sleep(1);
    }
    t.echo(`Selected IP range - ${net.localIp}/${mask}`, "Scanning for active SSH services...");
    await t.sleep(1);
    t.echo("");
    await t.sleep(2);
    // הטווח מתחיל ב-192.168.1.0, ולכן במסכה ארוכה מ-24 הוא קטן מכדי לכלול את .227
    const hosts = Number(mask) <= 24 || 2 ** (32 - Number(mask)) > net.lastOctet ? [net.host] : [];
    const logins = [];
    if (!hosts.length) t.echo("No active SSH services found.", "No targets to attack. Exiting.");
    else {
      t.echo("Active SSH services found on:", ...hosts.map(h => `[-] ${h}`), "",
        "Searching for rockyou.txt on the system... this might take a few seconds.");
      await t.sleep(2);
      t.echo("Found rockyou.txt", "");
      for (const host of hosts) {
        t.echo(`Starting automated assessment on: ${host}`);
        await t.sleep(4);
        t.echo("Found credentials.", "--- Extacting personal information... ---");
        logins.push(`IP: ${host} | User: ${net.user} | Password: ${net.password}`);
        await t.sleep(2);
        t.echo(...net.info.map(i => `[*] ${i}`), `[*] Local time: ${date()}`, L62, "");
      }
    }
    t.echo("", E39, "         FINAL SESSION REPORT          ", E39);
    if (hosts.length) t.echo("Hosts found with SSH service:", ...hosts.map(h => `[-] ${h}`));
    else t.echo("No hosts with open SSH ports were found.");
    t.echo(L39);
    if (logins.length) t.echo("SUCCESSFUL ACCESS GAINED ON:", ...logins.map(l => `[-] ${l}`), "");
    else t.echo("No successful logins were recorded.");
    t.echo(E39, "     GhostLogin Assessment Complete    ", E39);
  }

  /* ---------- פקודות המסוף ---------- */
  const documents = { host: "kali", path: "~/Documents" }, scripts = { host: "Kali", path: "~/Desktop/Scripts" };
  const GREP = 'sudo grep "| Attack:" /var/log/checker.log | tail -n 10';
  window.TOOLS = {
    date, nmapTime,
    start: { checker: "sudo bash checker.sh", vulner: "sudo bash vulner.sh", ghostlogin: "bash ghostlogin.sh" },
    home: { checker: documents, vulner: documents, ghostlogin: scripts },
    commands(place) {
      return place === scripts
        ? { "bash ghostlogin.sh": t => ghostlogin(t), "ls": t => t.echo("ghostlogin.sh") }
        : {
          "sudo bash checker.sh": t => checker(t, true), "sudo bash vulner.sh": t => vulner(t, true),
          "bash checker.sh": t => checker(t, false), "bash vulner.sh": t => vulner(t, false),
          [GREP]: t => t.echo(...checkerLog.slice(-10)),
          "ls": t => t.echo(["checker.sh", "vulner.sh", ...dirs, ...zips].sort().join("  "))
        };
    }
  };
})();
