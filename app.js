(function () {
  const DRAW_DURATION_MS = 1500;
  const MIN_DELAY_MS = 42;
  const MAX_DELAY_MS = 190;
  const PREVIEW_LIMIT = 54;
  const PRELOAD_CONCURRENCY = 12;
  const DRAW_SEQUENCE_SIZE = 28;
  const DRAW_WARMUP_SIZE = 6;
  const DRAW_ANIMATION_POOL_SIZE = 18;
  const PREVIEW_EAGER_LIMIT = 18;
  const DRAW_PRELOAD_TIMEOUT_MS = 520;

  const WEAPON_ORDER = [
    "Firebird", "Freeze", "Isida", "Tesla", "Hammer", "Twins", "Ricochet", "Vulcan",
    "Smoky", "Striker", "Thunder", "Tsunami", "Scorpion", "Magnum", "Railgun",
    "Gauss", "Shaft", "Hulls"
  ];

  const FALLBACK_WEAPONS = {
    Firebird: "火焰炮",
    Freeze: "冰风暴",
    Isida: "磁力炮",
    Tesla: "特斯拉",
    Hammer: "滑膛炮",
    Twins: "离子炮",
    Ricochet: "火龙珠",
    Vulcan: "极速炮",
    Smoky: "轰天炮",
    Striker: "火箭炮",
    Thunder: "雷暴炮",
    Tsunami: "海啸",
    Scorpion: "蝎子",
    Magnum: "马格南",
    Railgun: "激光炮",
    Gauss: "电磁炮",
    Shaft: "镭射炮",
    Hulls: "底盘"
  };

  const FALLBACK_RARITIES = {
    Common: "普通",
    Rare: "稀有",
    Epic: "史诗",
    Legendary: "传奇",
    Exotic: "特殊",
    Unknown: "未知"
  };

  const EXACT_AUGMENT_NAMES = {
    "Adaptive Reload": "自适应重载",
    "Dragon's Breath": "龙息",
    "Wyvern's Breath": "飞龙吐息",
    "Faster Horizontal Tracking": "更快速的水平跟踪",
    "Super Solenoids": "超级螺线管",
    "Shock Nanobot Injection": "震荡纳米机器人注射",
    "Vacuum Core": "真空核心",
    "Detonator": "引爆器",
    "Round Destabilization": "不稳定弹药",
    "Round Stabilization": "弹体稳定",
    "«death Herald» Compulsator": "《死亡使者》控制器",
    "Lightning Charge": "闪电弹药",
    "Bolter": "螺栓",
    "Destabilized Plasma": "失稳等离子体",
    "Magnetron": "磁控管",
    "Plasma Resonator": "等离子体谐振器",
    "Super-Smart Minus-Field": "超智能负能量场",
    "Rapid-Fire Mode": "速射模式",
    "Short-Band Emitter": "短波发射器",
    "Small Caliber Charging Machine": "小口径装填机",
    "Strict Ammunition Load": "严格弹药装载",
    "Manual Firing Mode": "手动射击模式",
    "Cryotron": "冷冻管",
    "Plasma Disruptor": "等离子体扰乱器",
    "Plasma Injector": "等离子体注射器",
    "Tectonic Plasma": "构造等离子体",
    "Vaporizer": "蒸发器"
  };

  const QUOTED_NAME_PARTS = {
    "spear": "长矛",
    "swarm": "集群",
    "tornado": "旋风",
    "wolfpack": "狼群",
    "brass knuckles": "指虎",
    "hunter": "猎人",
    "anvil": "铁砧",
    "corrosion": "腐蚀",
    "magneto": "磁电",
    "nanotech": "纳米科技",
    "noise": "噪声",
    "peacekeeper": "维和者",
    "salamander": "火蜥蜴",
    "sledgehammer": "大锤",
    "wyvern": "飞龙"
  };

  const NAME_TERMS = [
    ["Armor-Piercing", "穿甲"],
    ["Electromagnetic", "电磁"],
    ["Large Caliber", "大口径"],
    ["Hyperspeed", "超高速"],
    ["Incendiary", "燃烧"],
    ["Jamming", "干扰"],
    ["Magnetic", "磁性"],
    ["Paralyzing", "麻痹"],
    ["Toxic", "毒性"],
    ["Freezing", "冰冻"],
    ["Stunning", "眩晕"],
    ["Stun", "眩晕"],
    ["Cryo", "冷冻"],
    ["Emp", "电磁脉冲"],
    ["Vacuum", "真空"],
    ["Explosive", "爆破"],
    ["Rubberized", "橡胶"],
    ["Lightning", "闪电"],
    ["Shock", "震荡"],
    ["Tungsten", "钨芯"],
    ["Piercing", "穿甲"],
    ["Endothermic", "吸热"],
    ["Exothermic", "放热"],
    ["Electrifying", "电击"],
    ["Shocking", "震击"],
    ["Superconducting", "超导"],
    ["Subcaliber", "次口径"],
    ["Sizzling", "灼热"],
    ["Tectonic", "构造"],
    ["Nanobots", "纳米机器人"],
    ["Solenoids", "螺线管"],
    ["Discharge", "放电"],
    ["Missiles", "导弹"],
    ["Missile", "导弹"],
    ["Launcher", "发射器"],
    ["Shells", "炮弹"],
    ["Shell", "炮弹"],
    ["Rounds", "弹药"],
    ["Round", "弹药"],
    ["Pellets", "颗粒"],
    ["Salvo", "齐射"],
    ["Sight", "瞄准"],
    ["Field", "场"],
    ["Plasma", "等离子体"],
    ["Core", "核心"],
    ["Mix", "混合物"],
    ["Shot", "射击"],
    ["Band", "弹链"],
    ["Charge", "装药"],
    ["Mode", "模式"],
    ["Super", "超级"]
  ];

  const EFFECT_LABELS = {
    "Magazine size": "弹匣容量",
    "Time between two shots": "两发射击间隔时间",
    "Time between the two shots": "两发射击间隔时间",
    "Start of damage degression": "伤害初始下降",
    "End of damage degression": "伤害结束",
    "Damage percentage at the end of the degression": "伤害结束比例",
    "Damage percentage at the range of min. damage": "最低伤害距离比例",
    "Vertical/Horizontal scattering angle": "垂直/水平散射角",
    "Horizontal Angle of Scatter": "水平散射角",
    "Horizontal scatter angle": "水平散射角",
    "Vertical scatter angle": "垂直散射角",
    "Enemy highlight range": "敌人高光范围",
    "Range of enemy highlighting": "敌人高光范围",
    "Highlighting range": "高光范围",
    "Highlighting distance": "高光距离",
    "Impact force": "冲击力",
    "Impact Force": "冲击力",
    "Projectile impact force": "炮弹冲击力",
    "Salvo impact force": "齐射冲击力",
    "Splash damage impact force": "溅射伤害冲击力",
    "Salvo splash damage impact force": "齐射溅射伤害冲击力",
    "Arcade impact force": "街机冲击力",
    "Splash Damage Impact": "溅射伤害冲击力",
    "Impact force removed": "移除冲击力",
    "Impact force disabled": "禁用冲击力",
    "No impact force": "无冲击力",
    "Bullets per shot": "每发子弹数",
    "Pellets per shot": "每次射击颗粒数",
    "Shots per clip": "每个弹夹弹数",
    "Rockets per salvo": "每轮齐射火箭数",
    "Rockets in salvo": "齐射火箭数",
    "Recoil": "后坐力",
    "No recoil": "无后坐力",
    "Recoil force": "后坐力",
    "Reload time": "装填时间",
    "Reload time between shots": "射击间隔装填时间",
    "Reload time in Arcade mode": "街机模式装填时间",
    "Reload time after salvo": "齐射后装填时间",
    "Reload after salvo": "齐射后装填",
    "Reload reduction per enemy damaged": "每命中一个敌人的装填缩短",
    "Bullet reload": "子弹装填",
    "Single-shot reload time": "单发装填时间",
    "Sniping shot reload time": "狙击射击装填时间",
    "Arcade shot reload time": "街机射击装填时间",
    "Arcade shot reload": "街机射击装填",
    "Arcade reload": "街机装填",
    "Arcade reload time": "街机装填时间",
    "Clip reload time": "弹夹装填时间",
    "Clip reload": "弹夹装填",
    "Shot reload": "射击装填",
    "Reload": "装填",
    "Recharge time": "充能时间",
    "Recharge time after salvo": "齐射后充能时间",
    "Recharge rate after sniping shot": "狙击射击后充能速度",
    "Charge rate": "充能速度",
    "Charge rate in aiming mode": "瞄准模式充能速度",
    "Base reload time": "基础装填时间",
    "Critical damage": "暴击伤害",
    "Critical Damage": "暴击伤害",
    "Critical Hit Damage": "暴击伤害",
    "Critical damage -50%": "暴击伤害：-50%",
    "Critical Damage -50%": "暴击伤害：-50%",
    "Critical damage removed": "移除暴击伤害",
    "Critical damage removed (and no critical healing)": "移除暴击伤害和暴击治疗",
    "Critical hit removed": "移除暴击",
    "Critical hits removed": "移除暴击",
    "Critical hits disabled": "禁用暴击",
    "Critical hits removed (damage and healing)": "移除伤害和治疗暴击",
    "Critical hit chance": "暴击概率",
    "Critical Hit Chance": "暴击概率",
    "Critical chance": "暴击概率",
    "Critical chance step": "暴击概率阶梯",
    "Critical hit chance increase by +10%": "暴击概率提升：+10%",
    "Critical hit chance increases by +10%": "暴击概率提升：+10%",
    "Critical Hit Chance +10%": "暴击概率：+10%",
    "Critical damage chance +10%": "暴击伤害概率：+10%",
    "Critical stun": "暴击眩晕时间",
    "Max. critical hit chance": "最大暴击概率",
    "Maximum chance of critical hit": "最大暴击概率",
    "Maximum chance of critical damage": "最大暴击概率",
    "Maximum Critical Damage Chance": "最大暴击伤害概率",
    "Starting critical hit chance": "初始暴击概率",
    "Initial chance of critical damage": "初始暴击概率",
    "Initial Critical Damage Chance": "初始暴击概率",
    "Initial sniping damage": "初始狙击伤害",
    "Minimum chance of critical damage": "最低暴击概率",
    "Minimum Critical Damage Chance": "最低暴击伤害概率",
    "Increased chance of critical damage": "暴击概率提升",
    "Critical Damage Chance Increase": "暴击伤害概率提升",
    "Fixed critical chance": "固定暴击概率",
    "Chance of critical damage": "暴击概率",
    "Regular and critical damage": "普通与暴击伤害",
    "Normal and critical damage": "普通与暴击伤害",
    "Normal and critical damage increase": "普通与暴击伤害提升",
    "Regular damage": "普通伤害",
    "Normal damage": "普通伤害",
    "Standard damage": "标准伤害",
    "Weak damage": "弱伤害",
    "Weak damage percentage": "弱伤害比例",
    "Weak damage = 25%": "弱伤害 = 25%",
    "Damage": "伤害",
    "Arcade damage": "街机伤害",
    "Arcade Shot damage": "街机射击伤害",
    "Arcade Shot Damage": "街机射击伤害",
    "Arcade normal damage": "街机普通伤害",
    "Arcade critical damage": "街机暴击伤害",
    "Arcade Critical Shot damage": "街机暴击射击伤害",
    "Damage (Chain Lightning)": "链式闪电伤害",
    "Damage (Combo Shot with grenade)": "组合射击伤害（含榴弹）",
    "Combo damage": "组合伤害",
    "Additional damage": "额外伤害",
    "Damage at 2m": "2米处伤害",
    "Damage at 3m": "3米处伤害",
    "Damage at 4m": "4米处伤害",
    "Damage at 6m": "6米处伤害",
    "Damage at 6m (outer radius)": "6米处伤害（外圈）",
    "Damage at 9m (outer radius)": "9米处伤害（外圈）",
    "Critical damage at 4m": "4米处暴击伤害",
    "Maximum sniping damage": "最大狙击伤害",
    "Max. sniping damage": "最大狙击伤害",
    "Minimum sniping damage": "最小狙击伤害",
    "Min. sniping damage": "最小狙击伤害",
    "Final sniping damage": "最终狙击伤害",
    "Range": "射程",
    "Penetration": "穿透",
    "Range +50%": "射程：+50%",
    "Shot range": "射击距离",
    "Range of maximum damage": "最大伤害距离",
    "Range of max. damage": "最大伤害距离",
    "Range of minimum damage": "最低伤害距离",
    "Range of min. damage": "最低伤害距离",
    "Range (of minimum damage)": "最低伤害距离",
    "Low damage range": "低伤害距离",
    "Full damage range": "满伤害距离",
    "Min. and max. damage range": "最小/最大伤害距离",
    "Damage is not distance-dependent": "伤害不受距离影响",
    "Cone angle": "锥形角度",
    "Horizontal auto-aim angle": "水平自动瞄准角",
    "Horizontal aiming speed": "水平瞄准速度",
    "Vertical auto-aim": "垂直自动瞄准",
    "Lightning ball vertical auto-aim": "闪电球垂直自动瞄准",
    "Upward auto-aim": "向上自动瞄准",
    "Aiming time": "瞄准时间",
    "Aiming recovery time": "瞄准恢复时间",
    "Minimum angle of elevation": "最小仰角",
    "Turret elevation": "炮塔仰角",
    "Turret rotation speed": "炮塔旋转速度",
    "Turret Rotation Speed": "炮塔旋转速度",
    "Turret rotation acceleration": "炮塔旋转加速度",
    "Turret Rotation Acceleration": "炮塔旋转加速度",
    "Turret rotatory acceleration": "炮塔旋转加速度",
    "Turret rotary acceleration": "炮塔旋转加速度",
    "Coefficient of turret rotation slowdown while shooting": "射击时炮塔旋转减速系数",
    "Turret slowdown when firing": "开火时炮塔减速",
    "Initial Turret Angle": "炮塔初始角度",
    "Turning speed": "转向速度",
    "Turning acceleration": "转向加速度",
    "Rotation speed": "旋转速度",
    "Rotation acceleration": "旋转加速度",
    "Rotational acceleration": "旋转加速度",
    "Control mode": "控制模式",
    "Acceleration": "加速度",
    "Power": "动力",
    "Weight": "重量",
    "Top speed": "最高速度",
    "Target speed": "目标速度",
    "Target velocity": "目标速度",
    "Firing speed": "开火速度",
    "Upper temperature limit": "温度上限",
    "Temperature limit": "温度限制",
    "Time to overheat": "过热时间",
    "Time to overheating": "过热时间",
    "Heating rate": "加热速度",
    "Heating speed": "加热速度",
    "Freeze per tick": "每跳冻结量",
    "Freezing rate": "冻结速度",
    "Freeze speed": "冻结速度",
    "Slowdown from Freezing": "冰冻减速",
    "Damage taken from Burning": "受到燃烧伤害",
    "Afterburn effect removed": "移除燃烧后续效果",
    "Freezing effect removed": "移除冰冻效果",
    "Energy consumption": "能量消耗",
    "Energy consumption when healing": "治疗时能量消耗",
    "Energy consumption when idle": "空闲时能量消耗",
    "Energy consumption during healing": "治疗期间能量消耗",
    "Energy consumption when attacking": "攻击时能量消耗",
    "Energy consumption by sniping shot": "狙击射击能量消耗",
    "Energy consumed by sniping shot": "狙击射击能量消耗",
    "Energy consumed per shot": "每次射击能量消耗",
    "Energy consumed per arcade shot": "每次街机射击能量消耗",
    "Energy consumed per sniping shot": "每次狙击射击能量消耗",
    "Energy recovery rate": "能量恢复速度",
    "Energy recovery on target destruction": "摧毁目标时能量恢复",
    "Energy consumed": "能量消耗",
    "Destroying an enemy refills the energy tank": "摧毁敌人会补满能量槽",
    "Destroying an enemy reloads the clip": "摧毁敌人后装满弹夹",
    "Destroying an enemy fully reloads the turret": "摧毁敌人后完全装填炮塔",
    "Projectile speed": "炮弹速度",
    "Initial projectile speed": "初始炮弹速度",
    "Final projectile speed": "最终炮弹速度",
    "Maximum projectile speed": "最大炮弹速度",
    "Max. projectile speed": "最大炮弹速度",
    "Minimum projectile speed": "最小炮弹速度",
    "Min. Projectile speed": "最小炮弹速度",
    "Projectile speed after ricochet": "反弹后炮弹速度",
    "Projectile acceleration": "炮弹加速度",
    "Projectile acceleration time": "炮弹加速时间",
    "Projectile gravity": "炮弹重力",
    "Projectile gravitation": "炮弹重力",
    "Shell Gravity Coefficient": "炮弹重力系数",
    "Projectile gravity coefficient": "炮弹重力系数",
    "Minimum Shell Speed": "最小炮弹速度",
    "Maximum Shell Speed": "最大炮弹速度",
    "Min shell speed": "最小炮弹速度",
    "Max shell speed": "最大炮弹速度",
    "Minimum rocket speed": "最小火箭速度",
    "Maximum rocket speed": "最大火箭速度",
    "Initial rocket speed": "初始火箭速度",
    "Final rocket speed": "最终火箭速度",
    "Rocket acceleration time": "火箭加速时间",
    "Rocket acceleration phase duration": "火箭加速阶段持续时间",
    "Initial rocket angular speed": "初始火箭角速度",
    "Initial rocket max. angular velocity": "初始火箭最大角速度",
    "Initial rocket min. angular velocity": "初始火箭最小角速度",
    "Final rocket angular speed": "最终火箭角速度",
    "Rocket angular velocity": "火箭角速度",
    "Rockets angular velocity": "火箭角速度",
    "Pause between rockets in salvo": "齐射中火箭间隔",
    "Pause between salvo rockets": "齐射火箭间隔",
    "Pause between salvo's rockets": "齐射火箭间隔",
    "Salvo reload": "齐射装填",
    "Salvo reload time": "齐射装填时间",
    "Salvo damage": "齐射伤害",
    "Rockets will explode upon double-pressing fire button": "双击开火键会引爆火箭",
    "Rocket minimum splash damage radius": "火箭最小溅射伤害半径",
    "Rocket average splash damage radius": "火箭平均溅射伤害半径",
    "Splash radius": "溅射半径",
    "Splash damage added": "增加溅射伤害",
    "Splash damage removed": "移除溅射伤害",
    "Splash damage radius": "溅射伤害半径",
    "Splash Damage Radius": "溅射伤害半径",
    "Critical splash damage radius": "暴击溅射伤害半径",
    "Critical splash radius": "暴击溅射半径",
    "Critical damage explosion radius": "暴击伤害爆炸半径",
    "Minimum splash damage radius": "最小溅射伤害半径",
    "Average splash damage radius": "平均溅射伤害半径",
    "Average Splash damage radius": "平均溅射伤害半径",
    "Maximum splash damage radius": "最大溅射伤害半径",
    "Radius max. splash damage": "最大溅射伤害半径",
    "Radius avg. splash damage": "平均溅射伤害半径",
    "Radius min. splash damage": "最小溅射伤害半径",
    "Radius of average splash damage": "平均溅射伤害半径",
    "Minimum and critical splash damage radius": "最小和暴击溅射伤害半径",
    "Minimum, average, maximum and critical splash damage radiuses": "最小/平均/最大/暴击溅射伤害半径",
    "Radius of mean area damage in normal mode": "普通模式平均范围伤害半径",
    "Radius of maximum area damage": "最大范围伤害半径",
    "Radius of the average area of ​​damage": "平均范围伤害半径",
    "Radius of minimum area damage": "最小范围伤害半径",
    "Minimum area damage radius in normal mode": "普通模式最小范围伤害半径",
    "Radius of critical area damage": "暴击范围伤害半径",
    "Average splash damage": "平均溅射伤害",
    "Average and minimal splash damage": "平均与最小溅射伤害",
    "Average and minimum splash damage": "平均与最小溅射伤害",
    "Average area damage percentage": "平均范围伤害比例",
    "Minimal area damage percentage": "最小范围伤害比例",
    "Max. area damage radius of the grenade": "榴弹最大范围伤害半径",
    "Avg. area damage radius of the grenade": "榴弹平均范围伤害半径",
    "Min. area damage radius of the grenade": "榴弹最小范围伤害半径",
    "Maximum number of ricochets": "最大反弹次数",
    "Maximum number of projectile bounces": "炮弹最大反弹次数",
    "Max ricochet count": "最大反弹次数",
    "Maximum ricochet angle": "最大反弹角",
    "Minimum ricochet angle": "最小反弹角",
    "Min ricochet angle": "最小反弹角",
    "Shell minimum ricochet angle": "炮弹最小反弹角",
    "Ricochet effect disabled": "禁用反弹效果",
    "Projectiles can no longer ricochet": "炮弹不再反弹",
    "Rounds do not ricochet": "弹药不会反弹",
    "Ball lightning does not burst until the 11th impact and so is less likely to cause splash damage": "球状闪电第11次撞击前不会爆裂，较不容易造成溅射伤害",
    "Ball lightning does not burst until the 11th impact and is less likely to cause splash damage": "球状闪电第11次撞击前不会爆裂，较不容易造成溅射伤害",
    "Permits ball lightning to bounce off props, similar to Ricochet": "允许球状闪电像火龙珠一样从物体上反弹",
    "Lightning ball speed": "闪电球速度",
    "Lightning ball range": "闪电球射程",
    "Lightning ball reload": "闪电球装填",
    "Lightning ball damage": "闪电球伤害",
    "Lightning ball warmup time": "闪电球预热时间",
    "Tesla ball lightning damage": "特斯拉球状闪电伤害",
    "Radius of adding a tank to the chain (m)": "加入链条的坦克半径（米）",
    "Radius of adding ball lightning to the chain (m)": "加入链条的球状闪电半径（米）",
    "Range from one chain lightning to the next ball lightning": "链式闪电到下一颗球状闪电的距离",
    "Chain lightning range": "链式闪电距离",
    "Barrel startup time": "枪管启动时间",
    "Barrel slowdown time": "枪管减速时间",
    "Shot warmup time": "射击预热时间",
    "Weapon Charging Time": "武器充能时间",
    "Weapon Reload Time": "武器装填时间",
    "Launch speed": "发射速度",
    "Initial projectile speed = 30 m/s": "初始炮弹速度 = 30米/秒",
    "Projectile acceleration time = 1.5 s": "炮弹加速时间 = 1.5秒",
    "Shell acceleration phase duration": "炮弹加速阶段持续时间",
    "Amplification time": "蓄力时间",
    "Time to maximum charge level": "达到最大蓄力等级时间",
    "One shot at a time": "一次只能发射一发",
    "Number of steps when charging = 10": "充能阶段数 = 10",
    "Every third shot deals critical damage.": "每第三发造成暴击伤害。",
    "Every third hit is guaranteed to be a critical": "每第三次命中必定暴击",
    "Every fourth hit is guaranteed to be a critical": "每第四次命中必定暴击",
    "The first shot after spawning will be a critical": "重生后的第一发必定暴击",
    "Critical chance step increases even with shots that do not register on the target": "即使未命中目标，暴击概率阶梯也会增加",
    "Self damage at close range": "近距离自伤",
    "Self damage removed": "移除自伤",
    "Self-damage removed": "移除自伤",
    "Self-damage possible at close range": "近距离可能自伤",
    "Possibility of self-damage if not careful": "操作不慎可能自伤",
    "The blast radius damage can cause self-damage": "爆炸半径伤害可能造成自伤",
    "Damage boost is active only while you have at least 95% of your maximum HP.": "仅在生命值至少为上限95%时激活伤害加成",
    "Damage boost is active only while you have at least 85% of your maximum HP.": "仅在生命值至少为上限85%时激活伤害加成",
    "Damage boost is active only while you have at least 50% of your maximum HP.": "仅在生命值至少为上限50%时激活伤害加成",
    "Damage bonus only activates when health is ≤35%": "伤害加成仅在生命值≤35%时激活",
    "Damage bonus only activates when health is ≤25%": "伤害加成仅在生命值≤25%时激活",
    "Damage bonus only activates when health is ≤20%": "伤害加成仅在生命值≤20%时激活",
    "Effect is disabled when the tank has the Freezing status effect.": "坦克处于冰冻状态时效果失效",
    "Effect is disabled when the tank has the Freezing status effect": "坦克处于冰冻状态时效果失效",
    "Shooting a teammate heals them the same amount it would damage an unarmored enemy": "射击队友会按对无护甲敌人的伤害量进行治疗",
    "Shooting a teammate heals them the same amount it would damage an unarmored enemy. Healing gives from 1 to 10 reputation points, depending on the amount of health restored. Healing gives from 1 to 20 experience points, depending on the amount of health restored.": "射击队友会按对无护甲敌人的伤害量进行治疗；根据恢复生命值获得1-10声望点和1-20经验点。",
    "Healing rate": "治疗速度",
    "Normal healing rate": "普通治疗速度",
    "Critical healing": "暴击治疗",
    "Maximum critical healing chance": "最大暴击治疗概率",
    "Increases an ally's damage while healing": "治疗时提高队友伤害",
    "Healing is not affected by range": "治疗不受距离影响",
    "Splash damage does not heal allied tanks": "溅射伤害不会治疗友方坦克",
    "Picking up a supply box adds 1000 HP": "拾取补给箱增加1000生命值",
    "Recovers 500 HP": "恢复500生命值",
    "Health": "生命值",
    "Speed of overdrive reload (time)": "超能装填速度（时间）",
    "Speed of overdrive reload (score)": "超能装填速度（分数）",
    "Overdrive does not charge passively": "超能不会被动充能",
    "Reputation points earned in battle": "战斗中获得的声望点",
    "Healing gives 1-10 REPUTATION points, depending on the percentage of health restored": "根据恢复生命比例获得1-10声望点",
    "Healing gives 1-20 EXPERIENCE points, depending on the percentage of health restored": "根据恢复生命比例获得1-20经验点",
    "Healing gives from 1 to 10 reputation points, depending on the amount of health restored.": "根据恢复生命值获得1-10声望点。",
    "Healing gives from 1 to 20 experience points, depending on the amount of health restored.": "根据恢复生命值获得1-20经验点。",
    "Recovers HP at a rate of 35% of your base damage per tick while beam is on an enemy. Healing rate is not affected by protection, supplies, or status effects.": "光束命中敌人时，每跳按基础伤害的35%恢复生命值；治疗速度不受防护、补给或状态效果影响。",
    "Lay mines when a tank is not hit (mine lifetime 120 seconds)": "未命中坦克时布设地雷（地雷持续120秒）",
    "All sniping shots will consume the full energy bar and so require a full reload": "所有狙击射击都会消耗整条能量槽，因此需要完整重新装填",
    "Critical hits and rocket hits in a 5 meter splash radius lower the temperature of damaged enemy tanks, freezing them for 10 seconds.": "暴击和火箭命中会使5米溅射半径内受伤敌方坦克降温，并冰冻10秒。",
    "Critical hits and rocket hits in a 5 meter splash radius raise the temperature of damaged enemy tanks; a salvo applies 9 ticks of burn, and an arcade shot or a single rocket apply burn for 5 ticks.": "暴击和火箭命中会使5米溅射半径内受伤敌方坦克升温；齐射施加9跳燃烧，街机射击或单发火箭施加5跳燃烧。",
    "Critically hitting an enemy raises their temperature by +0.40. A maximum of two tanks can be set on fire in this way at any given time.": "暴击命中敌人会使其温度提高+0.40；同一时间最多可用这种方式点燃2辆坦克。",
    "Critical hits lower the temperature of all damaged enemy tanks by 1. Freezing": "暴击会使所有受伤敌方坦克温度降低1，并造成冰冻。",
    "Critical hits raise the temperature of all damaged enemy tanks by +0.4 Burning": "暴击会使所有受伤敌方坦克温度提高+0.4，并造成燃烧。",
    "Critical damage imposes Freezing status effect on an enemy tank for 5 seconds.": "暴击伤害会对敌方坦克施加冰冻状态，持续5秒。",
    "Each bullet that hits an enemy while your own tank is under the Burning status effect will increase their temperature by +0.07": "自身坦克处于燃烧状态时，每颗命中敌人的子弹都会使目标温度提高+0.07。",
    "Critical damage imposes Status Effect «Stun» on an enemy tank Critical stun: =0.4 sec": "暴击伤害会对敌方坦克施加眩晕状态；暴击眩晕时间 = 0.4秒",
    "Mines remain after death": "死亡后地雷保留",
    "70% of mines survive after death": "死亡后保留70%的地雷",
    "Grenade reload persists without respawning": "不重生也会保留手雷装填",
    "Grenade reload no longer requires respawn": "手雷装填不再需要重生",
    "Ideal for parkour": "适合跑酷",
    "Weak in regular battles": "常规战斗较弱",
    "Immunity from jammer, emp, stun, ap": "免疫干扰、电磁脉冲、眩晕、穿甲",
    "Immunity from jammer": "免疫干扰",
    "Immunity from emp": "免疫电磁脉冲",
    "Immunity from stun": "免疫眩晕",
    "Immunity from ap": "免疫穿甲",
    "Immunity from burning": "免疫燃烧",
    "Immunity from freezing": "免疫冰冻",
    "Provides complete immunity from Armor-Piercing": "完全免疫穿甲",
    "Provides complete immunity from Freezing .": "完全免疫冰冻",
    "Provides complete immunity from Freezing": "完全免疫冰冻",
    "Provides complete immunity from Electromagnetic Pulse": "完全免疫电磁脉冲",
    "Provides complete immunity from Burning .": "完全免疫燃烧",
    "Provides complete immunity from Burning": "完全免疫燃烧",
    "Provides complete immunity from Jammer": "完全免疫干扰",
    "Provides complete immunity from Stun": "完全免疫眩晕",
    "Chaos damage on death depending on hull weight": "被摧毁时根据底盘重量造成混沌伤害"
  };

  const EFFECT_TERMS = [
    ["Electromagnetic Pulse", "电磁脉冲"],
    ["Armor-Piercing", "穿甲"],
    ["Critical Damage Chance", "暴击伤害概率"],
    ["Critical Hit Chance", "暴击概率"],
    ["Critical hit chance", "暴击概率"],
    ["critical hit chance", "暴击概率"],
    ["Critical damage", "暴击伤害"],
    ["Critical Damage", "暴击伤害"],
    ["critical damage", "暴击伤害"],
    ["Critical hits", "暴击"],
    ["Critical Hits", "暴击"],
    ["critical hits", "暴击"],
    ["Critically hitting an enemy", "暴击命中敌人"],
    ["Critically hitting the enemy", "暴击命中敌人"],
    ["Critically hit enemies", "被暴击命中的敌人"],
    ["Hitting an enemy with a critical arcade shot", "街机暴击射击命中敌人"],
    ["Hitting an enemy with a critical shot", "暴击射击命中敌人"],
    ["Hitting an enemy tank", "命中敌方坦克"],
    ["Hitting an enemy", "命中敌人"],
    ["Sniping an enemy", "狙击命中敌人"],
    ["Rocket hits", "火箭命中"],
    ["ball lightning", "球状闪电"],
    ["Ball lightning", "球状闪电"],
    ["chain lightning", "链式闪电"],
    ["Chain Lightning", "链式闪电"],
    ["status effect", "状态效果"],
    ["Status Effect", "状态效果"],
    ["effect", "效果"],
    ["activates", "激活"],
    ["activate", "激活"],
    ["activated", "激活"],
    ["applies", "施加"],
    ["apply", "施加"],
    ["will", "会"],
    ["to all enemies", "给所有敌人"],
    ["to enemies", "给敌人"],
    ["to them", "给目标"],
    ["on enemies hit", "给被命中的敌人"],
    ["within a", "范围内"],
    ["from the point of impact", "从命中点起"],
    ["for", "持续"],
    ["all damaged enemy tanks", "所有受伤敌方坦克"],
    ["all enemy tanks", "所有敌方坦克"],
    ["damaged enemy tanks", "受伤敌方坦克"],
    ["enemy tanks", "敌方坦克"],
    ["enemy", "敌人"],
    ["enemies", "敌人"],
    ["target", "目标"],
    ["temperature", "温度"],
    ["lower", "降低"],
    ["lowers", "降低"],
    ["decrease", "降低"],
    ["decreases", "降低"],
    ["raise", "提高"],
    ["raises", "提高"],
    ["increase", "提高"],
    ["increases", "提高"],
    ["Freezing", "冰冻"],
    ["Burning", "燃烧"],
    ["Jammer", "干扰"],
    ["Stun", "眩晕"],
    ["Armor", "护甲"],
    ["EMP", "电磁脉冲"],
    ["damage", "伤害"],
    ["Damage", "伤害"],
    ["range", "距离"],
    ["Range", "距离"],
    ["radius", "半径"],
    ["Radius", "半径"],
    ["time", "时间"],
    ["Time", "时间"],
    ["reload", "装填"],
    ["Reload", "装填"],
    ["speed", "速度"],
    ["Speed", "速度"],
    ["chance", "概率"],
    ["Chance", "概率"],
    ["minimum", "最小"],
    ["Minimum", "最小"],
    ["maximum", "最大"],
    ["Maximum", "最大"],
    ["average", "平均"],
    ["Average", "平均"],
    ["initial", "初始"],
    ["Initial", "初始"],
    ["final", "最终"],
    ["Final", "最终"],
    ["normal", "普通"],
    ["Normal", "普通"],
    ["arcade", "街机"],
    ["Arcade", "街机"],
    ["sniping", "狙击"],
    ["Sniping", "狙击"],
    ["shot", "射击"],
    ["Shot", "射击"],
    ["shots", "射击"],
    ["projectile", "炮弹"],
    ["Projectile", "炮弹"],
    ["rocket", "火箭"],
    ["Rocket", "火箭"],
    ["rockets", "火箭"],
    ["Rockets", "火箭"],
    ["splash", "溅射"],
    ["Splash", "溅射"],
    ["area", "范围"],
    ["Area", "范围"],
    ["angle", "角度"],
    ["Angle", "角度"],
    ["horizontal", "水平"],
    ["Horizontal", "水平"],
    ["vertical", "垂直"],
    ["Vertical", "垂直"],
    ["healing", "治疗"],
    ["Healing", "治疗"],
    ["energy", "能量"],
    ["Energy", "能量"],
    ["consumed", "消耗"],
    ["consumption", "消耗"],
    ["recovery", "恢复"],
    ["Recovery", "恢复"],
    ["removed", "移除"],
    ["disabled", "禁用"],
    ["added", "增加"],
    ["possible", "可能"],
    ["not", "不"],
    ["does", ""],
    ["do", ""],
    ["is", ""],
    ["are", ""],
    ["and", "和"],
    ["or", "或"],
    ["of", "的"],
    ["the", ""],
    ["a", ""],
    ["an", ""]
  ];

  const TEXT_PHRASES = [
    ["Destroying an enemy fully reloads the clip. Shot reload takes less time. Clip reload takes longer if you don't destroy an enemy. Instant refill of the current ammo clip after destroying an enemy and decreased shot reload time. With enough luck you can pump out kills with factory efficiency. Otherwise, you'll have to contend with an empty ammo clip for a long time.", "摧毁敌人后立即装满弹夹，并缩短单发装填时间；如果没有摧毁敌人，弹夹装填会变慢。"],
    ["Increases turret damage when the tank is severely damaged. Adds a spare battery for the enhanced damage modulator, activated only in extreme circumstances when the tank's hull is critically damaged. Powering the damage modulator from two energy sources is unsafe - it may explode. The requirement to activate it only during severe damage likely exists to avoid warranty claims.", "坦克严重受损时提高炮塔伤害，只会在底盘濒危时触发。"],
    ["Increases turret damage when the tank is severely damaged. Adds a spare battery for the enhanced damage modulator, activated only in extreme circumstances when the tank's hull is critically damaged. Powering the damage modulator from two energy sources is unsafe — it may explode. The requirement to activate it only during severe damage likely exists to avoid warranty claims.", "坦克严重受损时提高炮塔伤害，只会在底盘濒危时触发。"],
    ["Significantly decreases your hull's weight", "大幅降低底盘重量"],
    ["Protects from armor-piercing effect", "免疫穿甲效果"],
    ["Provides complete immunity from Armor-Piercing", "完全免疫穿甲效果"],
    ["Provides complete immunity from Electromagnetic Pulse", "完全免疫电磁脉冲效果"],
    ["Provides complete immunity from Freezing", "完全免疫冰冻效果"],
    ["Provides complete immunity from Burning", "完全免疫燃烧效果"],
    ["Provides complete immunity from Jammer", "完全免疫干扰效果"],
    ["Provides complete immunity from Stun", "完全免疫眩晕效果"],
    ["Makes your tank immune to freeze effects", "使坦克免疫冰冻效果"],
    ["Makes your tank immune to heat damage", "使坦克免疫燃烧伤害"],
    ["Makes your tank immune to EMP", "使坦克免疫电磁脉冲"],
    ["A special kind of protection used in special scenarios", "用于特殊场景的专用防护"],
    ["Immunity from jammer", "免疫干扰"],
    ["Immunity from emp", "免疫电磁脉冲"],
    ["Immunity from stun", "免疫眩晕"],
    ["Immunity from ap", "免疫穿甲"],
    ["Immunity from burning", "免疫燃烧"],
    ["Immunity from freezing", "免疫冰冻"],
    ["Explodes on death", "被摧毁时发生爆炸"],
    ["Chaos damage on death depending on hull weight", "被摧毁时根据底盘重量造成混沌伤害"],
    ["Prevents destruction once per respawn", "每次重生可防止一次摧毁"],
    ["Prevents death once", "防止一次死亡"],
    ["Mines remain after death", "地雷在死亡后保留"],
    ["Grenade reload no longer requires respawn", "手雷装填不再需要重生"],
    ["Enhances hull parameters", "强化底盘参数"],
    ["Destroying an enemy reloads the clip", "摧毁敌人后装满弹夹"],
    ["Reload time between shots", "射击间隔装填时间"],
    ["Clip reload time", "弹夹装填时间"],
    ["Shots per clip", "每个弹夹弹数"],
    ["Regular and critical damage", "普通与暴击伤害"],
    ["Range of maximum damage", "最大伤害距离"],
    ["Range of minimum damage", "最低伤害距离"],
    ["Damage bonus only activates when health is", "伤害加成仅在生命值"],
    ["Effect is disabled when the tank has the Freezing status effect", "坦克处于冰冻状态时效果失效"],
    ["Speed of overdrive reload", "超能装填速度"],
    ["Overdrive charge speed", "超能充能速度"],
    ["Top speed", "最高速度"],
    ["Turning acceleration", "转向加速度"],
    ["Acceleration", "加速度"],
    ["Power", "动力"],
    ["Weight", "重量"],
    ["Cone angle", "锥形角度"],
    ["Critical damage", "暴击伤害"],
    ["Damage", "伤害"],
    ["Range", "射程"],
    ["Radius", "半径"],
    ["Duration", "持续时间"],
    ["Cooldown", "冷却时间"],
    ["Health", "生命值"],
    ["Armor-Piercing", "穿甲"],
    ["Electromagnetic Pulse", "电磁脉冲"],
    ["Freezing", "冰冻"],
    ["Burning", "燃烧"],
    ["Jammer", "干扰"],
    ["Stun", "眩晕"],
    ["overdrive", "超能"],
    ["enemy", "敌人"],
    ["tank", "坦克"],
    ["turret", "炮塔"],
    ["hull", "底盘"],
    ["clip", "弹夹"],
    ["shot", "射击"],
    ["shots", "射击"],
    ["effect", "效果"],
    ["reload", "装填"],
    ["armor", "护甲"]
  ];

  let augments = [];
  let localization = { weapons: {}, augments: {} };
  const imageCache = new Map();
  const decodedImages = new Map();
  const loadedImages = new Set();
  let lastResultId = "";
  let drawing = false;
  let activeWeapon = "ALL";

  function normalizeKey(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function containsLatin(value) {
    return /[A-Za-z]{2,}/.test(value || "");
  }

  function localizedFromMap(map, value) {
    if (!value || !map) return "";
    return map[value] || map[String(value).toLowerCase()] || map[normalizeKey(value)] || "";
  }

  function weaponName(value) {
    return localizedFromMap(localization.weapons, value) || FALLBACK_WEAPONS[value] || value || "未知";
  }

  function rarityName(value) {
    return FALLBACK_RARITIES[value] || value || "未知";
  }

  function augmentName(augment) {
    if (!augment) return "未知转化";
    const raw = augment.name || "";
    const normalized = normalizeKey(raw);
    const contextual = localizedFromMap(localization.augments, `${raw}|${augment.weapon}`);
    if (contextual) return contextual;

    if (normalized === "excelsior") {
      return augment.weapon === "Hulls"
        ? (localization.augments["Excelsior|Hulls"] || "卓越（底盘）")
        : (localization.augments["Excelsior|turret"] || "卓越（炮塔）");
    }

    if (normalized === "phoenix") {
      return augment.weapon === "Hulls"
        ? (localization.augments["Phoenix|Hulls"] || "凤凰（底盘）")
        : (localization.augments["Phoenix|turret"] || "凤凰（炮塔）");
    }

    return localizedFromMap(localization.augments, raw) || composeAugmentName(raw) || raw || "未知转化";
  }

  function composeAugmentName(rawName) {
    if (!rawName) return "";
    if (EXACT_AUGMENT_NAMES[rawName]) return EXACT_AUGMENT_NAMES[rawName];

    const launcher = rawName.match(/^Missile Launcher\s+«([^»]+)»$/i);
    if (launcher) return `导弹发射器《${quotedName(launcher[1])}》`;

    const quotedShell = rawName.match(/^«([^»]+)»\s+(Shells|Rounds)$/i);
    if (quotedShell) {
      const suffix = quotedShell[2].toLowerCase() === "rounds" ? "弹药" : "炮弹";
      return `《${quotedName(quotedShell[1])}》${suffix}`;
    }

    let output = rawName;
    for (const [en, zh] of NAME_TERMS.sort((a, b) => b[0].length - a[0].length)) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "gi"), zh);
    }
    output = output.replace(/[-\s]+/g, "");

    return containsLatin(output) ? "" : output;
  }

  function quotedName(value) {
    const key = String(value || "").toLowerCase();
    return QUOTED_NAME_PARTS[key] || value;
  }

  function replaceKnownTerms(value) {
    let output = value || "";
    const phrases = [...TEXT_PHRASES].sort((a, b) => b[0].length - a[0].length);

    for (const [en, zh] of phrases) {
      output = output.replace(new RegExp(escapeRegExp(en), "gi"), zh);
    }

    for (const weapon of WEAPON_ORDER) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(weapon)}\\b`, "gi"), weaponName(weapon));
    }

    return output;
  }

  function polishChineseText(value) {
    let output = String(value || "").trim();
    if (!output) return "";

    for (const weapon of WEAPON_ORDER) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(weapon)}\\b`, "g"), weaponName(weapon));
    }

    const augmentEntries = Object.entries(localization.augments || {})
      .filter(([key, text]) => key && text && !key.includes("|") && /[A-Za-z]/.test(key))
      .sort((a, b) => b[0].length - a[0].length);
    for (const [key, text] of augmentEntries) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(key)}\\b`, "g"), text);
    }

    return output
      .replace(/致命一击/g, "暴击")
      .replace(/致命射击/g, "暴击射击")
      .replace(/重击/g, "暴击")
      .replace(/严重伤害/g, "暴击伤害")
      .replace(/严重损坏/g, "暴击伤害")
      .replace(/致命伤害/g, "暴击伤害")
      .replace(/临界伤害/g, "暴击伤害")
      .replace(/临界损害/g, "暴击伤害")
      .replace(/关键射击/g, "暴击射击")
      .replace(/关键混合物/g, "暴击混合物")
      .replace(/暴击混合物达到临界浓度/g, "混合物达到临界浓度")
      .replace(/超速驾驶/g, "超能")
      .replace(/超速驱动/g, "超能")
      .replace(/超速装置/g, "超能")
      .replace(/供应/g, "补给")
      .replace(/重新加载/g, "装填")
      .replace(/重新装弹/g, "装填")
      .replace(/装弹/g, "装填")
      .replace(/剪辑/g, "弹夹")
      .replace(/镜头/g, "射击")
      .replace(/刀塔/g, "炮塔")
      .replace(/船体/g, "车体")
      .replace(/储罐/g, "坦克")
      .replace(/火灾期间/g, "开火时")
      .replace(/点火剂/g, "燃烧剂")
      .replace(/在太空中/g, "在空间中")
      .replace(/\bAI\b/g, "人工智能")
      .replace(/\bEMP\b/g, "电磁脉冲")
      .replace(/\bJammer\b/g, "干扰")
      .replace(/\bExcalibur\b/g, "圣剑")
      .replace(/\s+([，。；：！？、）])/g, "$1")
      .replace(/（\s+/g, "（")
      .replace(/\s+/g, " ")
      .trim();
  }

  function translateText(value) {
    if (!value) return "无";

    return replaceKnownTerms(value)
      .replace(/<=/g, "≤")
      .replace(/>=/g, "≥")
      .replace(/\bis\b/gi, "为")
      .replace(/\band\b/gi, "和")
      .replace(/\bfor\b/gi, "用于")
      .replace(/\bfrom\b/gi, "来自")
      .replace(/\bto\b/gi, "至")
      .replace(/\byour\b/gi, "你的")
      .replace(/\s+([，。；：])/g, "$1")
      .replace(/\.\s*/g, "。")
      .replace(/:\s*/g, "：")
      .replace(/;\s*/g, "；")
      .replace(/\s+/g, " ")
      .trim();
  }

  function metricText(value) {
    const matches = String(value || "").match(/[+-]\s*\d+(?:[.,]\d+)?%?|[≤≥<>]=?\s*\d+(?:[.,]\d+)?%?|\b\d+(?:[.,]\d+)?\s*(?:%|s|sec|seconds|m)?\b/gi);
    return matches
      ? matches.map((item) => item
        .replace(/\s+/g, "")
        .replace(/units\/sec/gi, "单位/秒")
        .replace(/m\/s/gi, "米/秒")
        .replace(/°\/sec|°\/s/gi, "°/秒")
        .replace(/ms\b/gi, "毫秒")
        .replace(/seconds?|sec/gi, "秒")
        .replace(/m\b/gi, "米")
        .replace(/\bs\b/gi, "秒"))
        .join(" / ")
      : "";
  }

  function effectExact(value) {
    const normalized = String(value || "").trim().replace(/\s+/g, " ");
    return EFFECT_LABELS[normalized] || "";
  }

  function formatEffectValue(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/vertical aiming/gi, "垂直瞄准")
      .replace(/units\/sec/gi, "单位/秒")
      .replace(/m\/s/gi, "米/秒")
      .replace(/°\/sec|°\/s/gi, "°/秒")
      .replace(/\bms\b/gi, "毫秒")
      .replace(/\btick\b/gi, "跳")
      .replace(/\bseconds?\b|\bsec\b/gi, "秒")
      .replace(/(\d)\s*meters?\b/gi, "$1米")
      .replace(/(\d)\s*kg\b/gi, "$1千克")
      .replace(/(\d)\s*m\b/gi, "$1米")
      .replace(/(\d)\s*s\b/gi, "$1秒")
      .replace(/\s*\/\s*/g, "/")
      .replace(/^=\s*/, "")
      .replace(/(\d)\s+(秒|米|毫秒|千克)/g, "$1$2")
      .trim();
  }

  function translateEffectValue(value) {
    let output = String(value || "").trim().replace(/\s+/g, " ");
    const nestedLabels = Object.keys(EFFECT_LABELS)
      .filter((label) => !/[。！?]/.test(label))
      .sort((a, b) => b.length - a.length);

    for (const label of nestedLabels) {
      const translatedLabel = EFFECT_LABELS[label];
      if (!translatedLabel || translatedLabel.includes("：") || translatedLabel.includes("=")) continue;
      const pattern = new RegExp(`${escapeRegExp(label)}\\s*:\\s*([^:]+?)(?=\\s+[A-Z][A-Za-z0-9./()\\- ]+\\s*:|$)`, "gi");
      output = output.replace(pattern, (_, nestedValue) => `${translatedLabel}：${formatEffectValue(nestedValue)}；`);
    }

    output = formatEffectValue(output)
      .replace(/([%米秒°千克])\s+([\u4e00-\u9fff][^：；]{1,28}：)/g, "$1；$2")
      .replace(/；+/g, "；")
      .replace(/；\s*$/g, "")
      .trim();

    if (containsLatin(output)) {
      const sentence = translateEffectSentence(output);
      if (sentence) return sentence;
    }

    return output;
  }

  function parseEffectStat(value) {
    const raw = String(value || "").trim().replace(/\s+/g, " ");
    if (!raw) return null;

    const colonIndex = raw.indexOf(":");
    if (colonIndex > -1) {
      return {
        label: raw.slice(0, colonIndex).trim(),
        value: raw.slice(colonIndex + 1).trim(),
        operator: ":"
      };
    }

    const equalMatch = raw.match(/^(.+?)\s*=\s*(.+)$/);
    if (equalMatch) {
      return {
        label: equalMatch[1].trim(),
        value: equalMatch[2].trim(),
        operator: "="
      };
    }

    const valueMatch = raw.match(/^(.+?)\s+([+\-−≤≥<>]?\s*\d+(?:[.,]\d+)?\s*(?:%|°(?:\/s|\/sec)?|m\/s|meters?|meter|m|ms|s|sec|seconds?|units\/sec)?)$/i);
    if (valueMatch) {
      return {
        label: valueMatch[1].trim(),
        value: valueMatch[2].trim(),
        operator: ":"
      };
    }

    return null;
  }

  function translateEffectLabel(label) {
    const exact = effectExact(label);
    if (exact) return exact;

    let output = String(label || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\bMax\./gi, "Maximum")
      .replace(/\bMin\./gi, "Minimum")
      .replace(/\bAvg\./gi, "Average")
      .replace(/Status Effect «([^»]+)»/gi, "$1状态效果")
      .replace(/status effect/gi, "状态效果");

    const terms = [...EFFECT_TERMS].sort((a, b) => b[0].length - a[0].length);
    for (const [en, zh] of terms) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "gi"), zh);
    }

    output = output
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s+/g, "")
      .replace(/[()]/g, "")
      .replace(/：+/g, "：")
      .trim();

    return containsLatin(output) ? "" : output;
  }

  function statusEffectName(value) {
    const key = String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
    const names = {
      "jammer": "干扰",
      "electromagnetic pulse": "电磁脉冲",
      "emp": "电磁脉冲",
      "stun": "眩晕",
      "armor-piercing": "穿甲",
      "freezing": "冰冻",
      "burning": "燃烧"
    };
    return names[key] || translateEffectLabel(value) || value;
  }

  function statusEffectPairs(value) {
    const pairs = [];
    const pattern = /(Jammer|Electromagnetic Pulse|EMP|Stun|Armor-Piercing|Freezing|Burning)\s*:\s*=?\s*([+-]?\d+(?:[.,]\d+)?\s*(?:sec|seconds?|s))/gi;
    let match;
    while ((match = pattern.exec(value)) !== null) {
      pairs.push(`${statusEffectName(match[1])}：${formatEffectValue(match[2])}`);
    }
    return pairs;
  }

  function actorText(value) {
    const raw = String(value || "");
    if (/^Sniping an enemy/i.test(raw)) return "狙击命中敌人";
    if (/^Critically hitting or sniping an enemy/i.test(raw)) return "暴击命中或狙击命中敌人";
    if (/^Critically hitting an enemy/i.test(raw)) return "暴击命中敌人";
    if (/^Hitting an enemy with a critical shot/i.test(raw)) return "暴击射击命中敌人";
    if (/^Hitting an enemy with either chain or ball lightning/i.test(raw)) return "链式闪电或球状闪电命中敌人";
    if (/^Hitting an enemy tank/i.test(raw)) return "命中敌方坦克";
    if (/^Hitting an enemy/i.test(raw)) return "命中敌人";
    if (/^Rocket hits in a ([\d.]+) meter splash radius/i.test(raw)) return `火箭在${RegExp.$1}米溅射半径内命中`;
    if (/^Rocket hits/i.test(raw)) return "火箭命中";
    if (/^Critical hits and ball lightning/i.test(raw)) return "暴击和球状闪电";
    if (/^Critical hits and rocket hits/i.test(raw)) return "暴击和火箭命中";
    if (/^Critical hits \(10m radius from explosion\)/i.test(raw)) return "爆炸10米半径内的暴击";
    if (/^Critical hits/i.test(raw)) return "暴击";
    if (/^Critical damage/i.test(raw)) return "暴击伤害";
    if (/^On a critical hit/i.test(raw)) return "暴击时";
    if (/^Ball lightning/i.test(raw)) return "球状闪电";
    if (/^When enemies are hit critically/i.test(raw)) return "敌人被暴击命中时";
    if (/^Applies/i.test(raw)) return "";
    return "";
  }

  function targetText(value) {
    const raw = String(value || "");
    let match = raw.match(/them and all enemies within a ([\d.]+) meter radius/i)
      || raw.match(/them and all enemies in a ([\d.]+) meter radius/i);
    if (match) return `对目标及${match[1]}米半径内所有敌人`;

    match = raw.match(/all enemies in a ([\d.]+) meter radius/i)
      || raw.match(/enemies in a ([\d.]+) meter radius/i);
    if (match) return `对${match[1]}米半径内所有敌人`;

    if (/all enemies hit|enemies hit|hit enemies/i.test(raw)) return "对所有被命中的敌人";
    if (/to enemies/i.test(raw)) return "对敌人";
    if (/on an enemy tank|on the enemy|to them/i.test(raw)) return "对目标";
    return "对目标";
  }

  function translateStatusEffectSentence(value) {
    const raw = String(value || "").trim().replace(/\s+/g, " ");
    const listMatch = raw.match(/^Hitting an enemy with a critical shot will apply the following status effects:\s*(.+)$/i);
    if (listMatch) {
      const pairs = statusEffectPairs(listMatch[1]);
      if (pairs.length) return `暴击射击命中敌人会施加以下状态效果：${pairs.join("；")}`;
    }

    let statusMatch = raw.match(/(?:apply|applies|imposes?)\s+(?:the\s+)?(Jammer|Electromagnetic Pulse|EMP|Stun|Armor-Piercing|Freezing|Burning)(?:\s+status effect)?/i);
    if (!statusMatch) {
      statusMatch = raw.match(/the\s+(Jammer|Electromagnetic Pulse|EMP|Stun|Armor-Piercing|Freezing|Burning)\s+status effect is activated/i);
    }
    if (!statusMatch) return "";

    const durationMatch = raw.match(/for\s+([+-]?\d+(?:[.,]\d+)?\s*(?:sec|seconds?|s))/i);
    const actor = actorText(raw);
    const target = targetText(raw);
    const duration = durationMatch ? `，持续${formatEffectValue(durationMatch[1])}` : "";
    const prefix = actor ? `${actor}会` : "";
    return `${prefix}${target}施加${statusEffectName(statusMatch[1])}状态${duration}`;
  }

  function temperatureTargetText(value) {
    const raw = String(value || "");
    let match = raw.match(/all enemies within a ([\d.]+) meter radius/i);
    if (match) return `${match[1]}米半径内所有敌人`;
    match = raw.match(/all enemy tanks in a ([\d.]+) meter radius/i);
    if (match) return `${match[1]}米半径内所有敌方坦克`;
    if (/all damaged enemy tanks|damaged enemy tanks/i.test(raw)) return "所有受伤敌方坦克";
    if (/enemies hit/i.test(raw)) return "被命中的敌人";
    if (/target's|their temperature|hit enemies/i.test(raw)) return "目标";
    return "敌人";
  }

  function translateTemperatureSentence(value) {
    const raw = String(value || "").trim().replace(/\s+/g, " ");
    const valueMatch = raw.match(/temperature[^.]*?\bby\s*([+-]?\d+(?:[.,]\d+)?)/i)
      || raw.match(/\bfrozen\s+by\s*([+-]?\d+(?:[.,]\d+)?)/i)
      || raw.match(/\bheated up\s+by\s*([+-]?\d+(?:[.,]\d+)?)/i);
    if (!valueMatch) return "";

    const lowers = /lower|lowers|decrease|decreases|frozen/i.test(raw);
    const raises = /raise|raises|increase|increases|heated/i.test(raw);
    if (!lowers && !raises) return "";

    const actor = actorText(raw) || "命中";
    const target = temperatureTargetText(raw);
    const verb = lowers ? "降低" : "提高";
    return `${actor}会使${target}温度${verb}${formatEffectValue(valueMatch[1])}`;
  }

  function translateStructuredEffectSentence(value) {
    return translateStatusEffectSentence(value) || translateTemperatureSentence(value);
  }

  function translateEffectSentence(value) {
    const exact = effectExact(value);
    if (exact) return exact;

    let output = formatEffectValue(value)
      .replace(/Status Effect «([^»]+)»/gi, "$1状态效果")
      .replace(/«([^»]+)»/g, "《$1》");

    const terms = [...EFFECT_TERMS].sort((a, b) => b[0].length - a[0].length);
    for (const [en, zh] of terms) {
      output = output.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "gi"), zh);
    }

    output = output
      .replace(/\s+([，。；：])/g, "$1")
      .replace(/\.\s*/g, "。")
      .replace(/,\s*/g, "，")
      .replace(/;\s*/g, "；")
      .replace(/\s+/g, "")
      .replace(/半径(\d+)/g, "半径$1")
      .trim();

    return containsLatin(output) ? "" : output;
  }

  function readableDescription(augment) {
    const translatedDescription = polishChineseText(augment.descriptionZh);
    if (translatedDescription) return translatedDescription;

    const translated = translateText(augment.description);
    if (translated && !containsLatin(translated)) return translated;

    return `${augmentName(augment)}是${weaponName(augment.weapon)}的战斗转化，会改变该装备的玩法表现。详细数值可参考下方效果。`;
  }

  function readableEffect(value, augment, type) {
    const raw = String(value || "");
    const exact = effectExact(raw);
    if (exact) return exact;

    const parsed = parseEffectStat(raw);
    if (parsed) {
      const label = translateEffectLabel(parsed.label);
      const metric = translateEffectValue(parsed.value || metricText(raw));
      if (label && metric) {
        return parsed.operator === "=" ? `${label} = ${metric}` : `${label}：${metric}`;
      }
    }

    const structuredSentence = translateStructuredEffectSentence(raw);
    if (structuredSentence) return structuredSentence;

    const effectSentence = translateEffectSentence(raw);
    if (effectSentence) return effectSentence;

    const translated = translateText(raw);
    if (translated && !containsLatin(translated)) return translated;

    const label = translateEffectLabel(raw);
    if (label) return label;

    return type === "bad" ? "存在限制条件" : "提供增益效果";
  }

  function randomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  function visiblePool() {
    return activeWeapon === "ALL" ? augments : augments.filter((item) => item.weapon === activeWeapon);
  }

  function warmupPool(pool) {
    const source = Array.isArray(pool) ? pool : [];
    if (activeWeapon !== "ALL") return source.slice(0, PREVIEW_EAGER_LIMIT);

    const selected = [];
    const seen = new Set();
    WEAPON_ORDER.forEach((weapon) => {
      const item = source.find((augment) => augment.weapon === weapon);
      if (item && !seen.has(item.id)) {
        selected.push(item);
        seen.add(item.id);
      }
    });

    for (const item of source) {
      if (selected.length >= PREVIEW_EAGER_LIMIT) break;
      if (!seen.has(item.id)) {
        selected.push(item);
        seen.add(item.id);
      }
    }

    return selected;
  }

  function shuffledItems(items) {
    const result = Array.isArray(items) ? [...items] : [];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function addAnimationCandidate(selected, seenIds, seenNames, item) {
    if (!item || !item.id || seenIds.has(item.id)) return false;
    const nameKey = normalizeKey(item.name);
    if (nameKey && seenNames.has(nameKey)) return false;
    selected.push(item);
    seenIds.add(item.id);
    if (nameKey) seenNames.add(nameKey);
    return true;
  }

  function buildAnimationBase(pool, finalAugment) {
    const source = (Array.isArray(pool) ? pool : []).filter((item) => (
      item && item.image && item.id !== (finalAugment && finalAugment.id)
    ));
    if (!source.length) return [];

    if (activeWeapon !== "ALL") {
      return shuffledItems(source).slice(0, DRAW_ANIMATION_POOL_SIZE);
    }

    const selected = [];
    const seenIds = new Set();
    const seenNames = new Set();

    WEAPON_ORDER.forEach((weapon) => {
      const choices = shuffledItems(source.filter((item) => item.weapon === weapon));
      const uniqueNameChoice = choices.find((item) => !seenNames.has(normalizeKey(item.name)));
      addAnimationCandidate(selected, seenIds, seenNames, uniqueNameChoice || choices[0]);
    });

    for (const item of shuffledItems(source)) {
      if (selected.length >= DRAW_ANIMATION_POOL_SIZE) break;
      addAnimationCandidate(selected, seenIds, seenNames, item);
    }

    if (selected.length < DRAW_WARMUP_SIZE) {
      for (const item of shuffledItems(source)) {
        if (selected.length >= DRAW_ANIMATION_POOL_SIZE) break;
        if (!item.id || seenIds.has(item.id)) continue;
        selected.push(item);
        seenIds.add(item.id);
      }
    }

    return shuffledItems(selected).slice(0, DRAW_ANIMATION_POOL_SIZE);
  }

  function pickRandomAugment(items) {
    if (!Array.isArray(items) || items.length === 0) return null;
    if (items.length === 1) return items[0];

    let result = items[randomIndex(items.length)];
    let guard = 0;
    while (result.id === lastResultId && guard < 8) {
      result = items[randomIndex(items.length)];
      guard += 1;
    }
    lastResultId = result.id;
    return result;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "";
  }

  function setStatus(value, isError) {
    const status = document.getElementById("statusText");
    if (!status) return;
    status.textContent = value;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function renderList(id, items, augment, type) {
    const list = document.getElementById(id);
    if (!list) return;
    list.innerHTML = "";
    const values = items && items.length ? items : ["无"];

    values.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item === "无" ? item : readableEffect(item, augment, type);
      list.appendChild(li);
    });
  }

  function renderIcon(augment) {
    const img = document.getElementById("augmentIcon");
    const fallback = document.getElementById("augmentFallback");
    if (!img || !fallback || !augment) return;
    const source = augment.image || "";
    fallback.textContent = augmentName(augment).slice(0, 2).toUpperCase();
    img.classList.remove("is-missing");
    img.onload = () => {
      loadedImages.add(source);
      img.classList.remove("is-missing");
    };
    img.onerror = () => img.classList.add("is-missing");
    img.alt = augmentName(augment);
    img.src = source;
  }

  function preloadImage(src) {
    if (!src) return Promise.resolve(false);
    if (decodedImages.has(src)) return Promise.resolve(true);
    if (imageCache.has(src)) return imageCache.get(src);
    if (typeof Image === "undefined") {
      loadedImages.add(src);
      decodedImages.set(src, { src });
      const fallbackPromise = Promise.resolve(true);
      imageCache.set(src, fallbackPromise);
      return fallbackPromise;
    }

    const promise = new Promise((resolve) => {
      const image = new Image();
      image.onload = async () => {
        if (image.decode) {
          try {
            await image.decode();
          } catch (error) {
            // The image is already loaded; decode can fail on some browsers.
          }
        }
        decodedImages.set(src, image);
        loadedImages.add(src);
        resolve(true);
      };
      image.onerror = () => resolve(false);
      image.src = src;
    });

    imageCache.set(src, promise);
    return promise;
  }

  async function preloadImages(items) {
    const sources = [...new Set((items || []).map((item) => item.image).filter(Boolean))];
    let cursor = 0;
    const workers = Array.from({ length: Math.min(PRELOAD_CONCURRENCY, sources.length) }, async () => {
      while (cursor < sources.length) {
        const source = sources[cursor];
        cursor += 1;
        await preloadImage(source);
      }
    });

    await Promise.all(workers);
  }

  function preloadImagesSoon(items) {
    preloadImages(items).catch((error) => console.warn("Image preload failed", error));
  }

  function renderResult(augment) {
    if (!augment) return;
    renderIcon(augment);
    setText("resultName", augmentName(augment));
    setText("resultWeapon", weaponName(augment.weapon));
    setText("resultRarity", rarityName(augment.rarity));
    setText("resultDescription", readableDescription(augment));
    renderList("advantagesList", augment.advantages, augment, "good");
    renderList("disadvantagesList", augment.disadvantages, augment, "bad");

    const rarity = document.getElementById("resultRarity");
    if (rarity) rarity.dataset.rarity = augment.rarity || "";
    const resultCard = document.getElementById("resultCard");
    if (resultCard) resultCard.dataset.rarity = augment.rarity || "";
    highlightStripItem(augment.id);
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function drawCandidates(pool) {
    return (Array.isArray(pool) ? pool : []).filter((item) => item.image && decodedImages.has(item.image));
  }

  function buildDrawSequence(pool) {
    const sequence = [];
    const preferred = drawCandidates(pool);
    const seen = new Set();
    const candidates = preferred.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    if (!candidates.length) return [];
    const count = DRAW_SEQUENCE_SIZE;
    while (sequence.length < count) {
      const batch = shuffledItems(candidates);
      if (sequence.length && batch.length > 1 && sequence[sequence.length - 1].id === batch[0].id) {
        [batch[0], batch[1]] = [batch[1], batch[0]];
      }
      sequence.push(...batch);
    }
    return sequence.slice(0, count).filter(Boolean);
  }

  function renderAnimationIcon(augment) {
    if (!augment || !augment.image || !decodedImages.has(augment.image)) return false;
    renderIcon(augment);
    return true;
  }

  async function animateDraw(finalAugment, drawPool) {
    const pool = drawPool && drawPool.length ? drawPool : visiblePool();
    const animationPool = pool.filter((item) => item.image && decodedImages.has(item.image));
    let frame = 0;

    if (!animationPool.length) {
      renderResult(finalAugment);
      return;
    }

    const start = performance.now();
    let now = start;
    while (now - start < DRAW_DURATION_MS) {
      const progress = Math.min((now - start) / DRAW_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const delay = MIN_DELAY_MS + (MAX_DELAY_MS - MIN_DELAY_MS) * eased;
      renderAnimationIcon(animationPool[frame % animationPool.length]);
      frame += 1;
      await wait(delay);
      now = performance.now();
    }
    renderResult(finalAugment);
  }

 async function loadAugments() {
    const response = await fetch("./augments.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`augments.json ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("augments.json is empty");
    return data;
}

  async function loadLocalization() {
    const response = await fetch("localization.json", { cache: "no-store" });
    if (!response.ok) return { weapons: {}, augments: {} };
    const data = await response.json();
    return {
      weapons: data.weapons || {},
      augments: data.augments || {}
    };
  }

  function setActiveWeapon(weapon) {
    activeWeapon = weapon;
    renderWeaponTabs();
    renderAugmentStrip();
    const pool = visiblePool();
    if (pool.length) renderResult(pool[0]);
    preloadImagesSoon(warmupPool(pool));
  }

  function readInitialWeapon() {
    return "ALL";
  }

  function renderWeaponTabs() {
    const tabs = document.getElementById("weaponTabs");
    if (!tabs) return;
    tabs.innerHTML = "";
    const counts = new Map();
    augments.forEach((item) => counts.set(item.weapon, (counts.get(item.weapon) || 0) + 1));
    const weapons = WEAPON_ORDER.filter((weapon) => counts.has(weapon));

    const all = document.createElement("button");
    all.type = "button";
    all.textContent = "全部";
    all.className = activeWeapon === "ALL" ? "active" : "";
    all.addEventListener("click", () => setActiveWeapon("ALL"));
    tabs.appendChild(all);

    weapons.forEach((weapon) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = weaponName(weapon);
      button.className = activeWeapon === weapon ? "active" : "";
      button.addEventListener("click", () => setActiveWeapon(weapon));
      tabs.appendChild(button);
    });
  }

  function renderAugmentStrip() {
    const strip = document.getElementById("augmentStrip");
    const count = document.getElementById("poolCount");
    if (!strip) return;
    const pool = visiblePool();
    if (count) count.textContent = `${pool.length} 个`;
    strip.innerHTML = "";

    pool.slice(0, PREVIEW_LIMIT).forEach((augment, index) => {
      const button = document.createElement("button");
      const img = document.createElement("img");
      button.type = "button";
      button.className = augment.id === lastResultId ? "augment-chip active" : "augment-chip";
      button.dataset.id = augment.id;
      button.dataset.rarity = augment.rarity || "";
      button.title = augmentName(augment);
      img.src = augment.image;
      img.alt = augmentName(augment);
      img.loading = index < PREVIEW_EAGER_LIMIT ? "eager" : "lazy";
      img.decoding = "async";
      button.appendChild(img);
      button.addEventListener("click", () => {
        lastResultId = augment.id;
        renderResult(augment);
        setStatus("已选择，可继续抽取");
      });
      strip.appendChild(button);
    });
  }

  function highlightStripItem(id) {
    document.querySelectorAll(".augment-chip").forEach((item) => {
      item.classList.toggle("active", item.dataset.id === id);
    });
  }

  async function draw() {
    const pool = visiblePool();
    if (drawing || pool.length === 0) return;
    const button = document.getElementById("drawButton");
    const finalAugment = pickRandomAugment(pool);
    const animationBase = buildAnimationBase(pool, finalAugment);

    drawing = true;
    if (button) button.disabled = true;
    try {
      setStatus("准备抽取...");
      preloadImagesSoon([finalAugment]);
      await Promise.race([preloadImages(animationBase), wait(DRAW_PRELOAD_TIMEOUT_MS)]);
      if (drawCandidates(animationBase).length < DRAW_WARMUP_SIZE) {
        await preloadImages(animationBase.slice(0, DRAW_WARMUP_SIZE));
      }
      const animationSequence = buildDrawSequence(animationBase);
      setStatus("抽取中...");
      document.body.classList.add("is-drawing");
      await animateDraw(finalAugment, animationSequence);
      setStatus("可以继续重抽");
    } catch (error) {
      console.error(error);
      setStatus("抽取失败，请再试一次", true);
    } finally {
      drawing = false;
      document.body.classList.remove("is-drawing");
      if (button) button.disabled = false;
    }
  }

  async function init() {
    const button = document.getElementById("drawButton");
    try {
      [augments, localization] = await Promise.all([loadAugments(), loadLocalization()]);
      activeWeapon = readInitialWeapon();
      renderWeaponTabs();
      renderAugmentStrip();
      renderResult(visiblePool()[0] || augments[0]);
      preloadImagesSoon(warmupPool(visiblePool()));
      setStatus("");
      if (button) {
        button.disabled = false;
        button.addEventListener("click", draw);
      }
    } catch (error) {
      console.error(error);
      setStatus("加载 augments.json 失败", true);
    }
  }

  window.LuckyAugment = { pickRandomAugment, translateText, augmentName, weaponName };
  document.addEventListener("DOMContentLoaded", init);
})();
