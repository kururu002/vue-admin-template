<template>
  <div class="app-container" @paste.passive="onPaste">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Bug Title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分享限制">
        <el-select v-model="form.permission" placeholder="限制">
          <el-option label="可查阅" value="watch" />
          <el-option label="可编辑" value="edit" />
        </el-select>
      </el-form-item>
      <el-form-item label="Image Name">
        <el-autocomplete
          v-model="form.imageName"
          class="inline-input"
          :fetch-suggestions="imageSearch"
          placeholder="可选"
        />

      </el-form-item>
      <el-form-item label="建立镜像">
        <el-switch
          v-model="form.imageRequired"
          :disabled="imageFilled"
          active-color="#13ce66"
        />
      </el-form-item>
      <!--TODO:Key word
      <el-form-item label="关键词">
        <el-autocomplete
          v-model="form.key"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
        />
      </el-form-item>
      -->
      <el-form-item label="初步扫描">
        <el-switch
          v-model="form.scanRequired"
          active-color="#13ce66"
        />
        <a href="https://www.sonarqube.org/features/multi-languages/">View Support Language</a>
      </el-form-item>
      <el-form-item label="上传截图或档案">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :http-request="uploadFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="form.fileList"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，贴上图片，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <!--
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      -->
      <el-form-item label="错误描述">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>

      </el-form-item>
      <el-form-item><router-view /></el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
import { imageList } from '@/api/form'
export default {
  data() {
    return {
      keywords: ['A# .NET', 'A# (Axiom)', 'A-0 System', 'A+', 'A++', 'ABAP', 'ABC', 'ABC ALGOL', 'ABLE', 'ABSET', 'ABSYS', 'ACC', 'Accent', 'Ace DASL', 'ACL2', 'ACT-III', 'Action!', 'ActionScript', 'Ada', 'Adenine', 'Agda', 'Agilent VEE', 'Agora', 'AIMMS', 'Alef', 'ALF', 'ALGOL 58', 'ALGOL 60', 'ALGOL 68', 'ALGOL W', 'Alice', 'Alma-0', 'AmbientTalk', 'Amiga E', 'AMOS', 'AMPL', 'APL', "App Inventor for Android's visual block language", 'AppleScript', 'Arc', 'ARexx', 'Argus', 'AspectJ', 'Assembly language', 'ATS', 'Ateji PX', 'AutoHotkey', 'Autocoder', 'AutoIt', 'AutoLISP / Visual LISP', 'Averest', 'AWK', 'Axum', 'B', 'Babbage', 'Bash', 'BASIC', 'bc', 'BCPL', 'BeanShell', 'Batch (Windows/Dos)', 'Bertrand', 'BETA', 'Bigwig', 'Bistro', 'BitC', 'BLISS', 'Blue', 'Bon', 'Boo', 'Boomerang', 'Bourne shell', 'bash', 'ksh', 'BREW', 'BPEL', 'C', 'C--', 'C++', 'C#', 'C/AL', 'Caché ObjectScript', 'C Shell', 'Caml', 'Candle', 'Cayenne', 'CDuce', 'Cecil', 'Cel', 'Cesil', 'Ceylon', 'CFEngine', 'CFML', 'Cg', 'Ch', 'Chapel', 'CHAIN', 'Charity', 'Charm', 'Chef', 'CHILL', 'CHIP-8', 'chomski', 'ChucK', 'CICS', 'Cilk', 'CL', 'Claire', 'Clarion', 'Clean', 'Clipper', 'CLIST', 'Clojure', 'CLU', 'CMS-2', 'COBOL', 'Cobra', 'CODE', 'CoffeeScript', 'Cola', 'ColdC', 'ColdFusion', 'COMAL', 'Combined Programming Language', 'COMIT', 'Common Intermediate Language', 'Common Lisp', 'COMPASS', 'Component Pascal', 'Constraint Handling Rules', 'Converge', 'Cool', 'Coq', 'Coral 66', 'Corn', 'CorVision', 'COWSEL', 'CPL', 'csh', 'CSP', 'Csound', 'CUDA', 'Curl', 'Curry', 'Cyclone', 'Cython', 'D', 'DASL', 'DASL', 'Dart', 'DataFlex', 'Datalog', 'DATATRIEVE', 'dBase', 'dc', 'DCL', 'Deesel', 'Delphi', 'DinkC', 'DIBOL', 'Dog', 'Draco', 'DRAKON', 'Dylan', 'DYNAMO', 'E', 'E#', 'Ease', 'Easy PL/I', 'Easy Programming Language', 'EASYTRIEVE PLUS', 'ECMAScript', 'Edinburgh IMP', 'EGL', 'Eiffel', 'ELAN', 'Elixir', 'Elm', 'Emacs Lisp', 'Emerald', 'Epigram', 'EPL', 'Erlang', 'es', 'Escapade', 'Escher', 'ESPOL', 'Esterel', 'Etoys', 'Euclid', 'Euler', 'Euphoria', 'EusLisp Robot Programming Language', 'CMS EXEC', 'EXEC 2', 'Executable UML', 'F', 'F#', 'Factor', 'Falcon', 'Fancy', 'Fantom', 'FAUST', 'Felix', 'Ferite', 'FFP', 'Fjölnir', 'FL', 'Flavors', 'Flex', 'FLOW-MATIC', 'FOCAL', 'FOCUS', 'FOIL', 'FORMAC', '@Formula', 'Forth', 'Fortran', 'Fortress', 'FoxBase', 'FoxPro', 'FP', 'FPr', 'Franz Lisp', 'Frege', 'F-Script', 'FSProg', 'G', 'Google Apps Script', 'Game Maker Language', 'GameMonkey Script', 'GAMS', 'GAP', 'G-code', 'Genie', 'GDL', 'Gibiane', 'GJ', 'GEORGE', 'GLSL', 'GNU E', 'GM', 'Go', 'Go!', 'GOAL', 'Gödel', 'Godiva', 'GOM (Good Old Mad)', 'Goo', 'Gosu', 'GOTRAN', 'GPSS', 'GraphTalk', 'GRASS', 'Groovy', 'Hack (programming language)', 'HAL/S', 'Hamilton C shell', 'Harbour', 'Hartmann pipelines', 'Haskell', 'Haxe', 'High Level Assembly', 'HLSL', 'Hop', 'Hope', 'Hugo', 'Hume', 'HyperTalk', 'IBM Basic assembly language', 'IBM HAScript', 'IBM Informix-4GL', 'IBM RPG', 'ICI', 'Icon', 'Id', 'IDL', 'Idris', 'IMP', 'Inform', 'Io', 'Ioke', 'IPL', 'IPTSCRAE', 'ISLISP', 'ISPF', 'ISWIM', 'J', 'J#', 'J++', 'JADE', 'Jako', 'JAL', 'Janus', 'JASS', 'Java', 'JavaScript', 'JCL', 'JEAN', 'Join Java', 'JOSS', 'Joule', 'JOVIAL', 'Joy', 'JScript', 'JScript .NET', 'JavaFX Script', 'Julia', 'Jython', 'K', 'Kaleidoscope', 'Karel', 'Karel++', 'KEE', 'Kixtart', 'KIF', 'Kojo', 'Kotlin', 'KRC', 'KRL', 'KUKA', 'KRYPTON', 'ksh', 'L', 'L# .NET', 'LabVIEW', 'Ladder', 'Lagoona', 'LANSA', 'Lasso', 'LaTeX', 'Lava', 'LC-3', 'Leda', 'Legoscript', 'LIL', 'LilyPond', 'Limbo', 'Limnor', 'LINC', 'Lingo', 'Linoleum', 'LIS', 'LISA', 'Lisaac', 'Lisp', 'Lite-C', 'Lithe', 'Little b', 'Logo', 'Logtalk', 'LPC', 'LSE', 'LSL', 'LiveCode', 'LiveScript', 'Lua', 'Lucid', 'Lustre', 'LYaPAS', 'Lynx', 'M2001', 'M4', 'Machine code', 'MAD', 'MAD/I', 'Magik', 'Magma', 'make', 'Maple', 'MAPPER', 'MARK-IV', 'Mary', 'MASM Microsoft Assembly x86', 'Mathematica', 'MATLAB', 'Maxima', 'Macsyma', 'Max', 'MaxScript', 'Maya (MEL)', 'MDL', 'Mercury', 'Mesa', 'Metacard', 'Metafont', 'MetaL', 'Microcode', 'MicroScript', 'MIIS', 'MillScript', 'MIMIC', 'Mirah', 'Miranda', 'MIVA Script', 'ML', 'Moby', 'Model 204', 'Modelica', 'Modula', 'Modula-2', 'Modula-3', 'Mohol', 'MOO', 'Mortran', 'Mouse', 'MPD', 'CIL', 'MSL', 'MUMPS', 'NASM', 'NATURAL', 'Napier88', 'Neko', 'Nemerle', 'nesC', 'NESL', 'Net.Data', 'NetLogo', 'NetRexx', 'NewLISP', 'NEWP', 'Newspeak', 'NewtonScript', 'NGL', 'Nial', 'Nice', 'Nickle', 'Nim', 'NPL', 'Not eXactly C', 'Not Quite C', 'NSIS', 'Nu', 'NWScript', 'NXT-G', 'o:XML', 'Oak', 'Oberon', 'Obix', 'OBJ2', 'Object Lisp', 'ObjectLOGO', 'Object REXX', 'Object Pascal', 'Objective-C', 'Objective-J', 'Obliq', 'Obol', 'OCaml', 'occam', 'occam-π', 'Octave', 'OmniMark', 'Onyx', 'Opa', 'Opal', 'OpenCL', 'OpenEdge ABL', 'OPL', 'OPS5', 'OptimJ', 'Orc', 'ORCA/Modula-2', 'Oriel', 'Orwell', 'Oxygene', 'Oz', 'P#', 'ParaSail (programming language)', 'PARI/GP', 'Pascal', 'Pawn', 'PCASTL', 'PCF', 'PEARL', 'PeopleCode', 'Perl', 'PDL', 'PHP', 'Phrogram', 'Pico', 'Picolisp', 'Pict', 'Pike', 'PIKT', 'PILOT', 'Pipelines', 'Pizza', 'PL-11', 'PL/0', 'PL/B', 'PL/C', 'PL/I', 'PL/M', 'PL/P', 'PL/SQL', 'PL360', 'PLANC', 'Plankalkül', 'Planner', 'PLEX', 'PLEXIL', 'Plus', 'POP-11', 'PostScript', 'PortablE', 'Powerhouse', 'PowerBuilder', 'PowerShell', 'PPL', 'Processing', 'Processing.js', 'Prograph', 'PROIV', 'Prolog', 'PROMAL', 'Promela', 'PROSE modeling language', 'PROTEL', 'ProvideX', 'Pro*C', 'Pure', 'Python', 'Q (equational programming language)', 'Q (programming language from Kx Systems)', 'Qalb', 'QtScript', 'QuakeC', 'QPL', 'R', 'R++', 'Racket', 'RAPID', 'Rapira', 'Ratfiv', 'Ratfor', 'rc', 'REBOL', 'Red', 'Redcode', 'REFAL', 'Reia', 'Revolution', 'rex', 'REXX', 'Rlab', 'RobotC', 'ROOP', 'RPG', 'RPL', 'RSL', 'RTL/2', 'Ruby', 'RuneScript', 'Rust', 'S', 'S2', 'S3', 'S-Lang', 'S-PLUS', 'SA-C', 'SabreTalk', 'SAIL', 'SALSA', 'SAM76', 'SAS', 'SASL', 'Sather', 'Sawzall', 'SBL', 'Scala', 'Scheme', 'Scilab', 'Scratch', 'Script.NET', 'Sed', 'Seed7', 'Self', 'SenseTalk', 'SequenceL', 'SETL', 'Shift Script', 'SIMPOL', 'SIGNAL', 'SiMPLE', 'SIMSCRIPT', 'Simula', 'Simulink', 'SISAL', 'SLIP', 'SMALL', 'Smalltalk', 'Small Basic', 'SML', 'Snap!', 'SNOBOL', 'SPITBOL', 'Snowball', 'SOL', 'Span', 'SPARK', 'Speedcode', 'SPIN', 'SP/k', 'SPS', 'Squeak', 'Squirrel', 'SR', 'S/SL', 'Stackless Python', 'Starlogo', 'Strand', 'Stata', 'Stateflow', 'Subtext', 'SuperCollider', 'SuperTalk', 'Swift (Apple programming language)', 'Swift (parallel scripting language)', 'SYMPL', 'SyncCharts', 'SystemVerilog', 'T', 'TACL', 'TACPOL', 'TADS', 'TAL', 'Tcl', 'Tea', 'TECO', 'TELCOMP', 'TeX', 'TEX', 'TIE', 'Timber', 'TMG', 'Tom', 'TOM', 'Topspeed', 'TPU', 'Trac', 'TTM', 'T-SQL', 'TTCN', 'Turing', 'TUTOR', 'TXL', 'TypeScript', 'Turbo C++', 'Ubercode', 'UCSD Pascal', 'Umple', 'Unicon', 'Uniface', 'UNITY', 'Unix shell', 'UnrealScript', 'Vala', 'VBA', 'VBScript', 'Verilog', 'VHDL', 'Visual Basic', 'Visual Basic .NET', 'Visual DataFlex', 'Visual DialogScript', 'Visual Fortran', 'Visual FoxPro', 'Visual J++', 'Visual J#', 'Visual Objects', 'Visual Prolog', 'VSXu', 'Vvvv', 'WATFIV, WATFOR', 'WebDNA', 'WebQL', 'Windows PowerShell', 'Winbatch', 'Wolfram', 'Wyvern', 'X++', 'X#', 'X10', 'XBL', 'XC', 'XMOS architecture', 'xHarbour', 'XL', 'Xojo', 'XOTcl', 'XPL', 'XPL0', 'XQuery', 'XSB', 'XSLT', 'XPath', 'Xtend', 'Yorick', 'YQL', 'Z notation', 'Zeno', 'ZOPL', 'ZPL'],
      recommendations: []
    }
  },
  computed: {
    form: {
      get: function() {
        return this.$store.state.form.form
      }
    },
    // TODO:empty check
    imageFilled: function() {
      return this.$store.state.form.form.imageName === ''
    }
  },
  watch: {
    form: {
      handler(val) {
        this.$store.dispatch('form/updateForm', val)
      }, deep: true }
  },
  mounted() {
    this.$store.dispatch('form/initAWS')
  },

  methods: {
    uploadFile(params, filename = null) {
      var _this = this
      this.$store.dispatch('form/upload2s3', { body: params.file, filename: filename || params.file.name }).then(
        // Log the fulfillment value
        (val) => {
          _this.$message(val)
        }).catch(
        // Log the rejection reason
        (reason) => {
          console.log('Error:' + reason)
        })
    },
    onSubmit() {
      this.$store.dispatch('form/submitForm').then(() => this.$router.push({ name: 'Table' }))
    },
    onPaste(clipboard) {
      if (clipboard.clipboardData) {
        var items = clipboard.clipboardData.items
        if (items) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].type.startsWith('image/')) {
              this.uploadFile({ file: items[i].getAsFile() }, 'screenshot_' + new Date() + '.' + items[i].type.substring(6))
              // image
              // var blob = items[i].getAsFile()
              // var URLObj = window.URL || window.webkitURL
              // var source = URLObj.createObjectURL(blob)
              // var fd = new FormData()
              // fd.append('data', blob)
              // import request and post blob
            }
          }
        }
      }
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    // TODO:Remove from S3
    handleRemove(file, fileList) {
      this.$store.commit('form/updateFileList', fileList)
    },
    handlePreview(file) {
      window.open(file.url, '_blank')
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    imageSearch(queryString, cb) {
      var data = []
      imageList().then(response => {
        if (response.data.summaries) {
          for (var item in response.data.summaries) {
            data.push({ 'value': response.data.summaries[item].name })
          }
        }
        cb(data)
      })
    }
    // TODO: KEY WORD
    // createFilter(queryString) {
    //   return (keywords) => {
    //     return (keywords.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // querySearch(queryString, cbque
    //   var keywords = this.keywords
    //   var results = queryString ? keywords.filter(this.createFilter(queryString)) : keywords
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

