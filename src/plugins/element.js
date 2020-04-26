import Vue from 'vue'
import {
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  Submenu,
  MenuItemGroup,
  Card,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Option,
  Select,
  Dialog,
  Loading,
  Table,
  TableColumn,
  Pagination,
  Input,
  Upload,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Tag,
  MessageBox,
  Badge,
  Popover,
  Divider,
  Step,
  Steps,
  Switch,
  Backtop
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// 设置语言
locale.use(lang)

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Option)
Vue.use(Select)
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Upload)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tag)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Divider)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Switch)
Vue.use(Backtop)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
