//
//  UI for IVPN Client Desktop
//  https://github.com/ivpn/desktop-app
//
//  Created by Stelnykovych Alexandr.
//  Copyright (c) 2020 Privatus Limited.
//
//  This file is part of the UI for IVPN Client Desktop.
//
//  The UI for IVPN Client Desktop is free software: you can redistribute it and/or
//  modify it under the terms of the GNU General Public License as published by the Free
//  Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//  The UI for IVPN Client Desktop is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
//  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
//  details.
//
//  You should have received a copy of the GNU General Public License
//  along with the UI for IVPN Client Desktop. If not, see <https://www.gnu.org/licenses/>.
//
import {
  VpnTypeEnum,
  PortTypeEnum,
  NormalizedConfigPortObject,
  ServersSortTypeEnum,
  ColorTheme,
  ColorThemeTrayIcon,
  DnsEncryption,
} from "@/store/types";
import { enumValueName } from "@/helpers/helpers";
import { Platform, PlatformEnum } from "@/platform/platform";

const defaultPort = { port: 2049, type: PortTypeEnum.UDP };

const getDefaultState = () => {
  let defState = {
    // SettingsSessionUUID allows to detect situations when settings was erased
    // This value should be the same as on daemon side. If it differs - current settings should be erased to default state
    SettingsSessionUUID: "",

    // session
    isExpectedAccountToBeLoggedIn: false,

    // VPN
    enableIPv6InTunnel: false,
    vpnType: VpnTypeEnum.WireGuard,
    // MTU - According to Windows specification: "... For IPv4 the minimum value is 576 bytes. For IPv6 the minimum is value is 1280 bytes... "
    mtu: null, // (number: [1280-65535]) MTU option is applicable only for WireGuard connections
    isMultiHop: false,
    serverEntry: null,
    serverExit: null,
    serverEntryHostId: null, // property is defined when selected specific host (contains only host ID: "us-tx1.gw.ivpn.net" => "us-tx1")
    serverExitHostId: null, // property is defined when selected specific host (contains only host ID: "us-tx1.gw.ivpn.net" => "us-tx1")
    isFastestServer: true,
    isRandomServer: false,
    isRandomExitServer: false,

    // Favorite gateway's list (strings [gateway])
    serversFavoriteList: [],
    // Favorite hosts list (strings [hostname])
    hostsFavoriteList: [],

    // List of servers to exclude from fastest servers list (gateway, strings)
    serversFastestExcludeList: [], // only gateway ID in use ("us-tx.wg.ivpn.net" => "us-tx")

    // general
    quitWithoutConfirmation: false,
    disconnectOnQuit: true,
    logging: false, // this parameter saves on the daemon's side

    // This object received out FROM DAEMON!
    daemonSettings: {
      IsAutoconnectOnLaunch: false,
      IsAutoconnectOnLaunchDaemon: false,
      UserDefinedOvpnFile: "",

      // obfsproxy configuration
      ObfsproxyConfig: {
        // 0 - do not use obfsproxy; obfs3 - 3; obfs4 - 4
        Version: 0,
        // Inter-Arrival Time (IAT)
        //	The values of IAT-mode can be “0”, “1”, or “2” in obfs4
        //	0 -	means that the IAT-mode is disabled and that large packets will be split by the network drivers,
        //		whose network fingerprints could be detected by censors.
        //	1 - means splitting large packets into MTU-size packets instead of letting the network drivers do it.
        //		Here, the MTU is 1448 bytes for the Obfs4 Bridge. This means the smaller packets cannot be reassembled for analysis and censoring.
        //	2 - means splitting large packets into variable size packets. The sizes are defined in Obfs4.
        Obfs4Iat: 0,
      },

      WiFi: {
        // canApplyInBackground:
        //	false - means the daemon applies actions in background
        //	true - VPN connection and Firewall status can be changed ONLY when UI client is connected to the daemon (UI app is running)
        canApplyInBackground: false,

        connectVPNOnInsecureNetwork: false,

        trustedNetworksControl: true,
        defaultTrustStatusTrusted: null, // null/true/false
        networks: null, // []{ ssid: "" isTrusted: false }

        actions: {
          unTrustedConnectVpn: true,
          unTrustedEnableFirewall: true,

          trustedDisconnectVpn: true,
          trustedDisableFirewall: true,
        },
      },

      //UserPrefs: {
      //  // (Linux)
      //  Platform: {
      //    IsDnsMgmtOldStyle bool
      //  }
      //  // (macOS)
      //  Platform: { }
      //  // (Windows)
      //  Platform: { }
      //}
    },

    // connection

    port: {
      OpenVPN: defaultPort,
      WireGuard: defaultPort,
    },

    // custom ports defined by user (based on the applicable port range)
    customPorts: [], // [ {type: "UDP/TCP", port: "X", range: {min: X, max: X}}, ... ],

    ovpnProxyType: "",
    ovpnProxyServer: "",
    ovpnProxyPort: 0,
    ovpnProxyUser: "",
    ovpnProxyPass: "",

    // firewall
    firewallActivateOnConnect: true,
    firewallDeactivateOnDisconnect: true,

    // antitracker
    isAntitracker: false,
    isAntitrackerHardcore: false,

    // dns
    dnsIsCustom: false,
    dnsCustomCfg: {
      DnsHost: "",
      Encryption: DnsEncryption.None,
      DohTemplate: "",
    },

    // firewall
    firewallCfg: {
      userExceptions: "",
    },

    // Split-Tunnel
    splitTunnel: {
      // A list of applications which was selected from apps-list
      // and date of last usage for each app.
      // It allow us to sort app list in the order starting from last used apps.
      favoriteAppsList: [], // {AppBinaryPath, LastUsedDate}
    },

    // UI
    showGatewaysWithoutIPv6: true,
    minimizedUI: false,
    minimizeToTray: true,
    showAppInSystemDock: false,
    serversSortType: ServersSortTypeEnum.City,
    colorTheme: ColorTheme.system,
    colorThemeTrayIcon: ColorThemeTrayIcon.auto,
    connectSelectedMapLocation: false,
    windowRestorePosition: null, // {x=xxx, y=xxx}
    showHosts: false, //Enable selection of individual servers in server selection list

    showISPInfo: false, // "Show ISP info in servers list"
    multihopWarnSelectSameCountries: true, // "Warn me when selecting Multihop entry and exit servers located in the same country"
    multihopWarnSelectSameISPs: false, // "Warn me when selecting Multihop entry and exit servers operated by the same ISP"

    // updates
    updates: {
      isBetaProgram: false,
    },
    skipAppUpdate: {
      genericVersion: null,
      daemonVersion: null,
      uiVersion: null,
    },
  };

  if (Platform() === PlatformEnum.Linux) {
    // Not all Linux distro support tray icons.
    // Therefore, we have to change default config for Linux.
    defState.minimizeToTray = false;
    defState.showAppInSystemDock = true; // 'skip-taskbar' not applicable for Linux (since Electron v20)
  }

  return defState;
};

// initial state
let initialState = getDefaultState();

export default {
  namespaced: true,

  state: initialState,

  mutations: {
    replaceState(state, val) {
      Object.assign(state, val);
    },

    resetToDefaults(state) {
      Object.assign(state, getDefaultState());
    },

    settingsSessionUUID(state, val) {
      state.SettingsSessionUUID = val;
    },

    isExpectedAccountToBeLoggedIn(state, val) {
      state.isExpectedAccountToBeLoggedIn = val;
    },

    enableIPv6InTunnel(state, val) {
      state.enableIPv6InTunnel = val;
    },
    vpnType(state, val) {
      state.vpnType = val;
    },
    mtu(state, val) {
      state.mtu = val;
    },
    isMultiHop(state, isMH) {
      state.isMultiHop = isMH;
    },
    serverEntry(state, srv) {
      if (srv == null || srv.gateway == null)
        throw new Error("Unable to change server. Wrong server object.");
      if (!isServerContainsHost(srv, state.serverEntryHostId))
        state.serverEntryHostId = null;
      state.serverEntry = srv;
    },
    serverExit(state, srv) {
      if (srv == null || srv.gateway == null)
        throw new Error("Unable to change server. Wrong server object.");
      if (!isServerContainsHost(srv, state.serverExitHostId))
        state.serverExitHostId = null;

      state.serverExit = srv;
    },
    serverEntryHostId(state, hostId) {
      if (hostId) {
        hostId = hostId.split(".")[0]; // convert hostname to hostId (if necessary)
        if (!isServerContainsHost(state.serverEntry, hostId)) hostId = null;
      }
      state.serverEntryHostId = hostId;
    },
    serverExitHostId(state, hostId) {
      if (hostId) {
        hostId = hostId.split(".")[0]; // convert hostname to hostId (if necessary)
        if (!isServerContainsHost(state.serverExit, hostId)) hostId = null;
      }
      state.serverExitHostId = hostId;
    },
    isFastestServer(state, val) {
      state.isFastestServer = val;
      if (val === true) state.isRandomServer = false;
    },
    isRandomServer(state, val) {
      state.isRandomServer = val;
      if (val === true) state.isFastestServer = false;
    },
    isRandomExitServer(state, val) {
      state.isRandomExitServer = val;
    },

    // Favorite gateway's list (strings)
    serversFavoriteList(state, val) {
      state.serversFavoriteList = val;
    },
    hostsFavoriteList(state, val) {
      state.hostsFavoriteList = val;
    },
    serversFastestExcludeList(state, val) {
      state.serversFastestExcludeList = val;
    },

    // general
    disconnectOnQuit(state, val) {
      state.disconnectOnQuit = val;
    },
    quitWithoutConfirmation(state, val) {
      state.quitWithoutConfirmation = val;
    },
    logging(state, val) {
      state.logging = val;
    },
    daemonSettings(state, val) {
      state.daemonSettings = val;
    },

    // connection
    setPort(state, portVal) {
      if (!portVal) {
        console.log("Warning! setPort() unable to set port. Port not defined.");
        return;
      }
      state.port[enumValueName(VpnTypeEnum, state.vpnType)] = portVal;
    },
    port(state, val) {
      if (!val || !val.OpenVPN || !val.WireGuard) {
        {
          console.log("Warning! port: unable to change port. Bad object.");
          return;
        }
      }
      state.port = val;
    },

    customPorts(state, val) {
      if (!state || !val) return;
      state.customPorts = val;
    },

    ovpnProxyType(state, val) {
      state.ovpnProxyType = val;
    },
    ovpnProxyServer(state, val) {
      state.ovpnProxyServer = val;
    },
    ovpnProxyPort(state, val) {
      state.ovpnProxyPort = val;
    },
    ovpnProxyUser(state, val) {
      state.ovpnProxyUser = val;
    },
    ovpnProxyPass(state, val) {
      state.ovpnProxyPass = val;
    },

    // firewall
    firewallActivateOnConnect(state, val) {
      state.firewallActivateOnConnect = val;
    },
    firewallDeactivateOnDisconnect(state, val) {
      state.firewallDeactivateOnDisconnect = val;
    },

    // antitracker
    isAntitracker(state, val) {
      state.isAntitracker = val;
    },
    isAntitrackerHardcore(state, val) {
      state.isAntitrackerHardcore = val;
    },

    // dns
    dnsIsCustom(state, val) {
      state.dnsIsCustom = val;
    },
    dnsCustomCfg(state, val) {
      state.dnsCustomCfg = val;
    },
    firewallCfg(state, val) {
      state.firewallCfg = val;
    },

    // SplitTunnel
    splitTunnel(state, val) {
      state.splitTunnel = val;
    },
    // UI
    showGatewaysWithoutIPv6(state, val) {
      state.showGatewaysWithoutIPv6 = val;
    },
    minimizedUI(state, val) {
      state.minimizedUI = val;
    },
    minimizeToTray(state, val) {
      state.minimizeToTray = val;
    },
    connectSelectedMapLocation(state, val) {
      state.connectSelectedMapLocation = val;
    },
    showAppInSystemDock(state, val) {
      state.showAppInSystemDock = val;
    },
    serversSortType(state, val) {
      state.serversSortType = val;
    },
    colorTheme(state, val) {
      state.colorTheme = val;
    },
    colorThemeTrayIcon(state, val) {
      state.colorThemeTrayIcon = val;
    },
    windowRestorePosition(state, val) {
      state.windowRestorePosition = val;
    },
    showHosts(state, val) {
      state.showHosts = val;
      // if disabled - erase info about currently selected hosts
      if (val !== true) {
        state.serverEntryHostId = null;
        state.serverExitHostId = null;
      }
    },

    showISPInfo(state, val) {
      state.showISPInfo = val;
    },
    multihopWarnSelectSameCountries(state, val) {
      state.multihopWarnSelectSameCountries = val;
    },
    multihopWarnSelectSameISPs(state, val) {
      state.multihopWarnSelectSameISPs = val;
    },

    // updates
    updates(state, val) {
      state.updates = val;
    },
    skipAppUpdate(state, val) {
      state.skipAppUpdate = val;
    },
  },

  getters: {
    vpnType: (state) => {
      return state.vpnType;
    },
    isFastestServer: (state) => {
      if (state.isMultiHop) return false;
      return state.isFastestServer;
    },
    isRandomServer: (state) => {
      return state.isRandomServer;
    },
    isRandomExitServer: (state) => {
      if (!state.isMultiHop) return false;
      return state.isRandomExitServer;
    },
    getPort: (state) => {
      return state.port[enumValueName(VpnTypeEnum, state.vpnType)];
    },

    isConnectionUseObfsproxy: (state) => {
      try {
        if (state.vpnType !== VpnTypeEnum.OpenVPN) return false;
        return state.daemonSettings.ObfsproxyConfig.Version > 0;
      } catch (e) {
        console.error(e);
      }
      return false;
    },

    favoriteServers: (state, getters, rootState, rootGetters) => {
      // Get favorite servers for current protocol
      try {
        // All favorite servers (for all protocols)
        let favorites = state.serversFavoriteList;
        // servers for current protocol
        let activeServers = rootGetters["vpnState/activeServers"];
        if (!activeServers || !favorites) return null;

        return activeServers.filter((s) => favorites.includes(s.gateway));
      } catch (e) {
        console.error("Failed to get Favorite servers: ", e);
        return null;
      }
    },
    // Returns array of information objects about favorite hosts:
    // host object extended by all properties from parent server object +favHostParentServerObj +favHost
    favoriteHosts: (state, getters, rootState, rootGetters) => {
      // Get favorite servers for current protocol
      try {
        // All favorite hostnames (for all protocols)
        let fHostnames = state.hostsFavoriteList.slice();
        // Servers for current protocol
        let activeServers = rootGetters["vpnState/activeServers"];
        if (!activeServers || !fHostnames) return null;

        // All hostnames for current protocol
        let activeServersHostsHashed = {};
        for (const s of activeServers) {
          for (const h of s.hosts) {
            activeServersHostsHashed[h.hostname] = s;
          }
        }

        // Looking for host objects for current protocol
        let ret = []; // array: [{host{}, server{}, isFavoriteHost: true}]
        for (const h of fHostnames) {
          if (!activeServersHostsHashed[h]) continue;

          const svr = activeServersHostsHashed[h];
          for (const host of svr.hosts) {
            if (host.hostname == h) {
              let favHostExInfo = Object.assign({}, svr); // copy all info about location... etc.
              favHostExInfo = Object.assign(favHostExInfo, host); // overwrite host-related properties (like ping info)
              favHostExInfo.gateway = svr.gateway + ":" + host.hostname; // to avoid duplicate keys in UI lists
              favHostExInfo.favHostParentServerObj = svr; // original parent server object
              favHostExInfo.favHost = host; // original host object

              ret.push(favHostExInfo);
            }
          }
        }
        return ret;
      } catch (e) {
        console.error("Failed to get Favorite hosts: ", e);
        return null;
      }
    },
  },

  // can be called from renderer
  actions: {
    resetToDefaults(context) {
      context.commit("resetToDefaults");
      // Necessary to initialize selected VPN servers
      const denyMultihopServersFromSameCountry = true;
      updateSelectedServers(context, denyMultihopServersFromSameCountry);
    },

    daemonSettings(context, val) {
      context.commit("daemonSettings", val);
      ensurePortsSelectedCorrectly(context);
    },

    isExpectedAccountToBeLoggedIn(context, val) {
      context.commit("isExpectedAccountToBeLoggedIn", val);
    },

    enableIPv6InTunnel(context, val) {
      context.commit("enableIPv6InTunnel", val);
    },
    vpnType(context, val) {
      context.commit("vpnType", val);
      // selected servers should be of correct VPN type. Necessary to update them
      updateSelectedServers(context);
    },
    mtu(context, val) {
      context.commit("mtu", val);
    },
    isMultiHop(context, val) {
      if (context.rootGetters["account/isMultihopAllowed"] === false)
        context.commit("isMultiHop", false);
      else {
        const oldVal = this.state.settings.isMultiHop;
        context.commit("isMultiHop", val);

        // do not change port if MH value was not changed (otherwise, new connection request will be sent)
        if (val === true && oldVal !== val) {
          const applicablePorts =
            context.rootGetters["vpnState/connectionPorts"];
          if (applicablePorts && applicablePorts.length > 0)
            context.commit(
              "setPort",
              getDefaultPortFromList(
                applicablePorts,
                context.getters["getPort"]
              )
            );
        }
      }
    },
    serverEntry(context, srv) {
      context.commit("serverEntry", srv);
      updateSelectedServers(context); // just to be sure entry-  and exit- servers are from different countries
    },
    serverExit(context, srv) {
      context.commit("serverExit", srv);
      updateSelectedServers(context); // just to be sure entry-  and exit- servers are from different countries
    },
    serverEntryHostId(context, hostId) {
      context.commit("serverEntryHostId", hostId);
    },
    serverExitHostId(context, hostId) {
      context.commit("serverExitHostId", hostId);
    },

    // Ensure the selected hosts equals to connected one. Of not equals - erase host selection
    serverEntryHostIPCheckOrErase(context, hostIp) {
      if (!this.state.settings.serverEntryHostId) return;
      const svr = this.state.settings.serverEntry;
      const hostId = this.state.settings.serverEntryHostId;
      let hostConnected = getServerHostByIp(svr, hostIp);
      let hostSelected = getServerHostById(svr, hostId);

      if (
        !hostConnected ||
        !hostSelected ||
        hostConnected.hostname != hostSelected.hostname
      )
        context.commit("serverEntryHostId", null);
    },
    serverExitHostCheckOrErase(context, hostname) {
      if (!this.state.settings.serverExitHostId) return;
      if (!hostname) {
        context.commit("serverExitHostId", null);
        return;
      }
      let hostId = hostname.split(".")[0]; // convert hostname to hostId (if necessary)
      if (hostId != this.state.settings.serverExitHostId)
        context.commit("serverExitHostId", null);
    },

    isFastestServer(context, val) {
      context.commit("isFastestServer", val);
    },
    isRandomServer(context, val) {
      context.commit("isRandomServer", val);
    },
    isRandomExitServer(context, val) {
      context.commit("isRandomExitServer", val);
    },

    // Favorite gateway's list (strings)
    serversFavoriteList(context, val) {
      context.commit("serversFavoriteList", val);
    },
    hostsFavoriteList(context, val) {
      context.commit("hostsFavoriteList", val);
    },
    serversFastestExcludeList(context, val) {
      context.commit("serversFastestExcludeList", val);
    },

    // general
    disconnectOnQuit(context, val) {
      context.commit("disconnectOnQuit", val);
    },
    quitWithoutConfirmation(context, val) {
      context.commit("quitWithoutConfirmation", val);
    },
    logging(context, val) {
      context.commit("logging", val);
    },

    // connection
    setPort(context, portVal) {
      context.commit("setPort", portVal);
    },

    ovpnProxyType(context, val) {
      context.commit("ovpnProxyType", val);
    },
    ovpnProxyServer(context, val) {
      context.commit("ovpnProxyServer", val);
    },
    ovpnProxyPort(context, val) {
      context.commit("ovpnProxyPort", val);
    },
    ovpnProxyUser(context, val) {
      context.commit("ovpnProxyUser", val);
    },
    ovpnProxyPass(context, val) {
      context.commit("ovpnProxyPass", val);
    },

    addNewCustomPort(context, val) {
      console.log("New custom port:", val);
      doAddNewCustomPort(context, val);
    },

    // firewall
    firewallActivateOnConnect(context, val) {
      context.commit("firewallActivateOnConnect", val);
    },
    firewallDeactivateOnDisconnect(context, val) {
      context.commit("firewallDeactivateOnDisconnect", val);
    },

    // antitracker
    isAntitracker(context, val) {
      context.commit("isAntitracker", val);
    },
    isAntitrackerHardcore(context, val) {
      context.commit("isAntitrackerHardcore", val);
    },

    // dns
    dnsIsCustom(context, val) {
      context.commit("dnsIsCustom", val);
    },
    dnsCustomCfg(context, val) {
      context.commit("dnsCustomCfg", val);
    },
    firewallCfg(context, val) {
      context.commit("firewallCfg", val);
    },

    // SplitTunnel
    saveAddedAppCounter(context, appBinaryPath) {
      if (!appBinaryPath) return;

      let favoriteAppsList = [];
      if (
        this.state.settings.splitTunnel &&
        this.state.settings.splitTunnel.favoriteAppsList
      ) {
        // max len of 'favorite list' - 10 elements
        favoriteAppsList =
          this.state.settings.splitTunnel.favoriteAppsList.slice(0, 9);
      }

      let isFound = false;
      favoriteAppsList.forEach(function (element, index, theArray) {
        if (!element || !element.AppBinaryPath) return;
        if (element.AppBinaryPath == appBinaryPath) {
          theArray[index] = {
            AppBinaryPath: element.AppBinaryPath,
            LastUsedDate: new Date(),
          };
          isFound = true;
        }
      });
      if (isFound !== true) {
        favoriteAppsList.push({
          AppBinaryPath: appBinaryPath,
          LastUsedDate: new Date(),
        });
      }

      favoriteAppsList.sort(function (a, b) {
        return new Date(b.LastUsedDate) - new Date(a.LastUsedDate);
      });

      // create new (updated) splitTunnel object
      let st = {};
      if (this.state.settings.splitTunnel) {
        st = Object.assign(st, this.state.settings.splitTunnel);
      }
      st.favoriteAppsList = favoriteAppsList;
      context.commit("splitTunnel", st);
    },

    // UI
    showGatewaysWithoutIPv6(context, val) {
      context.commit("showGatewaysWithoutIPv6", val);
    },
    minimizedUI(context, val) {
      context.commit("minimizedUI", val);
    },
    minimizeToTray(context, val) {
      context.commit("minimizeToTray", val);
    },
    connectSelectedMapLocation(context, val) {
      context.commit("connectSelectedMapLocation", val);
    },
    showAppInSystemDock(context, val) {
      context.commit("showAppInSystemDock", val);
    },
    serversSortType(context, val) {
      context.commit("serversSortType", val);
    },
    colorTheme(context, val) {
      context.commit("colorTheme", val);
    },
    colorThemeTrayIcon(context, val) {
      context.commit("colorThemeTrayIcon", val);
    },
    showHosts(context, val) {
      context.commit("showHosts", val);
    },

    showISPInfo(context, val) {
      context.commit("showISPInfo", val);
    },
    multihopWarnSelectSameCountries(context, val) {
      context.commit("multihopWarnSelectSameCountries", val);
    },
    multihopWarnSelectSameISPs(context, val) {
      context.commit("multihopWarnSelectSameISPs", val);
    },

    // UPDATES
    updates(context, val) {
      context.commit("updates", val);
    },
    skipAppUpdate(context, val) {
      context.commit("skipAppUpdate", val);
    },

    // HELPERS
    updateSelectedServers(context) {
      updateSelectedServers(context);
    },
  },
};

function updateSelectedServers(context, isDenyMultihopServersFromSameCountry) {
  // - define selected servers (if not initialized)
  // - update selected servers if VPN type changed (try to use vpnType-related servers from the same location [country\city])
  // - if multi-hop entry- and exit- servers are from same country -> use first default exit server from another country
  // - ensure if selected servers exists in a servers list and using latest data
  // - ensure if selected ports exists in a servers configuration
  // TODO: ensure IPv6 configuration
  if (!context || !context.rootGetters || !context.rootState) {
    console.error("Update selected servers failed (context not defined)");
    return;
  }

  const state = context.state;
  const servers = context.rootGetters["vpnState/activeServers"];
  const serversHashed = context.rootState.vpnState.serversHashed;
  if (servers.length <= 0) return;

  let serverEntry = state.serverEntry;
  let serverExit = state.serverExit;

  // HELPER FUNCTIONS
  function getVpnServerType(server) {
    if (!server) return null;
    if (!server.hosts) return null;

    for (let h of server.hosts) {
      if (h && h.public_key) return VpnTypeEnum.WireGuard;
      else return VpnTypeEnum.OpenVPN;
    }
    return null;
  }
  function findServerFromLocation(servers, countryCode, city) {
    let retServerByCountry = null;
    for (let i = 0; i < servers.length; i++) {
      let srv = servers[i];
      if (srv.country_code === countryCode) {
        if (srv.city === city) return srv;
        if (retServerByCountry != null) retServerByCountry = srv;
      }
    }
    return retServerByCountry;
  }

  // ensure if selected servers exists in a servers list and using latest data
  if (serverEntry != null) {
    serverEntry = serversHashed[serverEntry.gateway];
  }
  if (serverExit != null) {
    serverExit = serversHashed[serverExit.gateway];
  }

  // ensure selected servers have correct VPN type (if not - use correct server from same location)
  if (serverEntry != null) {
    if (getVpnServerType(serverEntry) !== state.vpnType) {
      serverEntry = findServerFromLocation(
        servers,
        serverEntry.country_code,
        serverEntry.city
      );
    }
  }
  if (serverExit != null) {
    if (getVpnServerType(serverExit) !== state.vpnType) {
      serverExit = findServerFromLocation(
        servers,
        serverExit.country_code,
        serverExit.city
      );
    }
  }

  // entry and exit servers should not have same gateway
  if (
    serverEntry != null &&
    serverExit != null &&
    serverEntry.gateway === serverExit.gateway
  )
    serverExit = null;

  if (isDenyMultihopServersFromSameCountry === true) {
    // entry and exit servers should be from different countries
    if (
      serverEntry != null &&
      serverExit != null &&
      serverEntry.country_code === serverExit.country_code
    )
      serverExit = null;
  }

  // init selected servers (if not initialized)
  let cnt = servers.length;
  for (let i = 0; serverEntry == null && i < cnt; i++) {
    if (
      serverExit == null ||
      servers[i].country_code !== serverExit.country_code
    ) {
      serverEntry = servers[i];
    }
  }
  for (let i = 0; serverExit == null && i < cnt; i++) {
    if (
      serverEntry == null ||
      servers[i].country_code !== serverEntry.country_code
    ) {
      serverExit = servers[i];
    }
  }

  //
  // Update selected servers (in necessary)
  //
  if (serverEntry !== state.serverEntry)
    context.commit("serverEntry", serverEntry);
  if (serverExit !== state.serverExit) context.commit("serverExit", serverExit);

  // update selected hosts (if necessary)
  let entryHost = state.serverEntryHostId;
  let exitHost = state.serverExitHostId;
  if (entryHost && !isServerContainsHost(state.serverEntry, entryHost))
    context.commit("serverEntryHostId", null);
  if (exitHost && !isServerContainsHost(state.serverExit, exitHost))
    context.commit("serverExitHostId", null);

  //
  // Remove servers/hosts from favorite list (if they are not exists anymore)
  //
  let favServersChanged = false;
  let favHostsChanged = false;
  let favServers = state.serversFavoriteList;
  for (const gw of state.serversFavoriteList) {
    if (!serversHashed[gw]) {
      favServers = favServers.filter((fGw) => gw != fGw);
      favServersChanged = true;
    }
  }

  const hostsHashed = context.rootState.vpnState.hostsHashed;
  let favHosts = state.hostsFavoriteList;
  for (const h of state.hostsFavoriteList) {
    if (!hostsHashed[h]) {
      favHosts = favHosts.filter((fh) => h != fh);
      favHostsChanged = true;
    }
  }

  if (favServersChanged) context.commit("serversFavoriteList", favServers);
  if (favHostsChanged) context.commit("hostsFavoriteList", favHosts);

  //
  // Ensure if selected ports exists in a servers configuration or port is selected correctly
  //
  ensurePortsSelectedCorrectly(context);
}

function isPortExists(ports, port) {
  for (const configPort of ports) {
    const p = NormalizedConfigPortObject(configPort);
    if (p && p.type === port.type && p.port === port.port) return true;
  }
  return false;
}

// Ensure if selected ports exists in a servers configuration or port is selected correctly
function ensurePortsSelectedCorrectly(context) {
  if (!context || !context.rootGetters || !context.rootState) {
    console.error("ensurePortsSelectedCorrectly: failed (context not defined)");
    return;
  }

  // if we still not received configuration info (servers.json) - do nothing
  if (context.rootGetters["vpnState/isConfigInitialized"] !== true) return;

  // clean custom ports which are not applicable anymore (range is not exists anymore)
  eraseNonAcceptableCustomPorts(context);

  const state = context.state;

  let funcGetDefaultPort = function (ports) {
    for (const configPort of ports) {
      const p = NormalizedConfigPortObject(configPort);
      if (p) return p;
    }
    return null;
  };

  // returns null - if port is ok; otherwise - port value which have to be applied
  let funcTestPort = function (allPorts, applicablePorts, currPort) {
    if (!allPorts) return null;

    let retPort = null;

    // add custom ports to base list of all ports
    if (context.rootState.settings.customPorts)
      allPorts = allPorts.concat(context.rootState.settings.customPorts);

    if (allPorts && allPorts.length > 0 && !isPortExists(allPorts, currPort)) {
      console.log(`Selected port does not exists anymore!`);
      retPort = funcGetDefaultPort(allPorts);
    }
    // Check is port applicable (according to current settings)
    if (
      applicablePorts &&
      applicablePorts.length > 0 &&
      !isPortExists(applicablePorts, retPort ? retPort : currPort)
    ) {
      console.log(`Selected port not applicable!`);
      retPort = funcGetDefaultPort(applicablePorts);
    }
    return retPort;
  };

  const portsCfg = context.rootState.vpnState.servers.config.ports;
  let cPort = Object.assign({}, state.port);

  const funcGetPorts = context.rootGetters["vpnState/funcGetConnectionPorts"];
  const applicableWg = funcGetPorts(VpnTypeEnum.WireGuard);
  const applicableOvpn = funcGetPorts(VpnTypeEnum.OpenVPN);
  let portOvpn = funcTestPort(portsCfg.openvpn, applicableOvpn, cPort.OpenVPN);
  let portWg = funcTestPort(portsCfg.wireguard, applicableWg, cPort.WireGuard);
  if (portOvpn) cPort.OpenVPN = portOvpn;
  if (portWg) cPort.WireGuard = portWg;
  if (portOvpn || portWg) {
    context.commit("port", cPort);
  }
}

function isAcceptablePortForRange(p, range) {
  if (!range || !p) return false;
  if (
    range.find(
      (r) => p.type === r.type && p.port >= r.range.min && p.port <= r.range.max
    ) === undefined
  )
    return false;
  return true;
}

function doAddNewCustomPort(context, port) {
  port = NormalizedConfigPortObject(port);
  if (!context || !port) return;
  try {
    const getRanges =
      context.rootGetters["vpnState/funcGetConnectionPortRanges"];

    const state = context.state;
    const currVpnPortRanges = getRanges(state.vpnType);

    if (!isAcceptablePortForRange(port, currVpnPortRanges)) return;

    // check if custom port already exists
    if (isPortExists(state.customPorts, port) === true) return;

    const clone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };

    // update custom ports
    let newCustomPorts = clone(state.customPorts);
    newCustomPorts.push(port);
    context.commit("customPorts", newCustomPorts);

    // apply port
    context.dispatch("setPort", port);

    // ensure that the port selected correctly
    ensurePortsSelectedCorrectly(context);
  } catch (e) {
    console.error(e);
  }
}

function eraseNonAcceptableCustomPorts(context) {
  try {
    if (!context) return;
    // if we still not received configuration info (servers.json) - do nothing
    if (context.rootGetters["vpnState/isConfigInitialized"] !== true) return;

    const getRanges =
      context.rootGetters["vpnState/funcGetConnectionPortRanges"];

    const state = context.state;

    const rangesOvpn = getRanges(VpnTypeEnum.OpenVPN);
    const rangesWg = getRanges(VpnTypeEnum.WireGuard);

    let newCustomPorts = [];
    state.customPorts.forEach((p) => {
      if (
        isAcceptablePortForRange(p, rangesOvpn) ||
        isAcceptablePortForRange(p, rangesWg)
      )
        newCustomPorts.push(p);
    });

    if (newCustomPorts.length != state.customPorts.length) {
      console.log(
        "Warning! Removing custom ports that do not belong to new ranges!"
      );
      context.commit("customPorts", newCustomPorts);
    }
  } catch (e) {
    console.error(e);
  }
}

function isServerContainsHost(server, hostID) {
  // hostID: "us-tx1.gw.ivpn.net" => "us-tx1"
  if (!hostID) return false;
  for (const h of server.hosts) {
    if (h.hostname.startsWith(hostID + ".")) return true;
  }
  return false;
}

function getServerHostByIp(server, hostIP) {
  if (!hostIP) return null;
  for (const h of server.hosts) {
    if (h.host == hostIP) return h;
  }
  return null;
}

function getServerHostById(server, hostId) {
  if (!hostId) return null;
  hostId = hostId.split(".")[0]; // convert hostname to hostId (if necessary)
  for (const h of server.hosts) {
    if (h.hostname.startsWith(hostId + ".")) return h;
  }
  return null;
}

function getDefaultPortFromList(ports, curPort) {
  let isDefaultPortExists = false;
  for (const f of ports) {
    if (f.type == defaultPort.type && f.port == defaultPort.port)
      isDefaultPortExists = true;
    if (f.type == curPort.type && f.port == curPort.port) return curPort;
  }
  if (isDefaultPortExists) return defaultPort;
  return ports[0];
}
