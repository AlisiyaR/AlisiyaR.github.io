// מצב הרשת הפיקטיבי של הדמו. שום דבר כאן לא נסרק: אלה נתונים קבועים.
// מקור: צילומי המסך ודוחות ה-PDF במאגר cybersecurity-lab-projects.
// "inferred" = ערך שלא מופיע בתיעוד והושלם לפי התנהגות הכלים.
(() => {
  // שם המשתמש בדמו (במעבדה המקורית היה שם אחר). אפשר לשנות רק כאן.
  const USER = "user";
  // 20 הפורטים של nmap -sU --top-ports 20
  const UDP20 = [[53, "domain"], [67, "dhcps"], [68, "dhcpc"], [69, "tftp"], [123, "ntp"], [135, "msrpc"], [137, "netbios-ns"],
    [138, "netbios-dgm"], [139, "netbios-ssn"], [161, "snmp"], [162, "snmptrap"], [445, "microsoft-ds"], [500, "isakmp"],
    [514, "syslog"], [520, "route"], [631, "ipp"], [1434, "ms-sql-m"], [1900, "upnp"], [4500, "nat-t-ike"], [49152, "unknown"]];
  const udpLine = (port, state, service) => (port + "/udp").padEnd(10) + state.padEnd(14) + service;
  const silentUdp = UDP20.map(([p, s]) => udpLine(p, "open|filtered", s));

  // חמשת הפורטים של nmap -sU --top-ports 5 (VULNER)
  const UDP5 = [[123, "ntp"], [137, "netbios-ns"], [138, "netbios-dgm"], [161, "snmp"], [631, "ipp"]];
  const udp5 = (state, width) => [
    "PORT".padEnd(8) + "STATE".padEnd(width) + "SERVICE".padEnd(12) + "VERSION",
    ...UDP5.map(([p, s]) => `${p}/udp `.padEnd(8) + state.padEnd(width) + s)];
  const noTcp = ip => [`All 1000 scanned ports on ${ip} are in ignored states.`, "Not shown: 1000 filtered tcp ports (no-response)"];
  const dns = ["Not shown: 999 closed tcp ports (reset)", "PORT   STATE    SERVICE VERSION", "53/tcp filtered domain"];
  const ssh = ["Not shown: 999 filtered tcp ports (no-response)", "PORT   STATE SERVICE VERSION",
    "22/tcp open  ssh     OpenSSH 10.3p1 Debian 5 (protocol 2.0)"];
  const linux = "Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel";
  const cve = [[60002, "9.4"], [60000, "7.5"], [59999, "7.5"], [60001, "6.5"], [59998, "6.5"], [59997, "5.4"], [59996, "5.4"], [59995, "5.4"]];

  window.LAB = {
    user: USER, users: ["root", USER],
    checker: {
      localIp: "192.168.101.130", gateway: "192.168.101.2", iface: "eth0",
      // סדר ה-hosts כמו בצילומים: המחשב המקומי אחרון
      hosts: {
        "192.168.101.1": { tcp: [], udp: silentUdp, passwords: null }, // inferred
        "192.168.101.2": { tcp: [], // inferred
          udp: [udpLine(53, "open", "domain"), ...silentUdp.slice(1)], passwords: null },
        "192.168.101.254": { tcp: [], udp: silentUdp, passwords: null }, // inferred
        "192.168.101.130": { tcp: ["22/tcp open  ssh", "80/tcp open  http"],
          udp: [udpLine(53, "open|filtered", "domain")], passwords: { [USER]: "1234" } }
      }
    },
    vulner: {
      localIp: "192.168.101.130",
      customList: `/home/${USER}/Documents/my_password_list.txt`,
      existingDirs: ["text"],
      // latency, זמני ריצה, UDP ו-NSE של .1, .2 ו-.254: inferred
      hosts: {
        "192.168.101.1": {
          tcp: { up: "(0.00045s latency)", lines: noTcp("192.168.101.1"), time: "21.58" },
          udp: { up: "(0.00041s latency)", lines: udp5("open|filtered", 14), time: "12.37" },
          nse: { up: "(0.00044s latency)", lines: noTcp("192.168.101.1"), time: "32.14" } },
        "192.168.101.2": {
          tcp: { up: "(0.00021s latency)", lines: dns, time: "1.84" },
          udp: { up: "(0.00019s latency)", lines: udp5("open|filtered", 14), time: "12.31" },
          nse: { up: "(0.00020s latency)", lines: dns, time: "12.46" } },
        "192.168.101.254": {
          tcp: { up: "(0.00033s latency)", lines: noTcp("192.168.101.254"), time: "21.49" },
          udp: { up: "(0.00030s latency)", lines: udp5("open|filtered", 14), time: "12.35" },
          nse: { up: "(0.00031s latency)", lines: noTcp("192.168.101.254"), time: "32.09" } },
        "192.168.101.130": {
          tcp: { up: "(0.000033s latency)", lines: [...ssh, linux], time: "4.89" },
          udp: { up: "(0.000048s latency)", lines: udp5("closed", 7), time: "0.20" },
          nse: { up: "(0.000026s latency)", time: "19.06", lines: [...ssh, "| vulners: ", "|   cpe:/a:openbsd:openssh:10.3p1: ",
            ...cve.map(([n, score], i) => `${i === cve.length - 1 ? "|_" : "| "}     \tCVE-2026-${n}\t${score}\thttps://vulners.com/cve/CVE-2026-${n}`), linux] },
          passwords: { [USER]: "1234" } }
      }
    },
    ghostlogin: {
      localIp: "192.168.1.0", host: "192.168.1.227", lastOctet: 227,
      user: USER, password: "123456",
      // העיר והספק הוחלפו בערכי דוגמה, לשמירה על פרטיות
      info: [`Username: ${USER}`, "OS version: Kali GNU/Linux Rolling", "Country: Israel", "City: Tel Aviv",
        "System running for: up 4 hours, 18 minutes", "Service provider: Bezeq"]
    }
  };
})();
