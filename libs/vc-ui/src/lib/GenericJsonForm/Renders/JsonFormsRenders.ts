import { MaterialDateTimeControl, materialDateTimeControlTester, MaterialNumberControl, materialNumberControlTester, MaterialTextControl, materialTextControlTester } from "./InputRenders/controls";
import { MaterialHorizontalLayoutRenderer, materialHorizontalLayoutTester } from "./Layouts";
import  MaterializedGroupLayoutRenderer, { materialGroupTester }  from "./Layouts/GroupLayout";


export const Renderers = [
  { tester: materialGroupTester, renderer: MaterializedGroupLayoutRenderer },
  { tester: materialTextControlTester, renderer: MaterialTextControl },
  { tester: materialDateTimeControlTester, renderer: MaterialDateTimeControl },
  { tester: materialNumberControlTester, renderer: MaterialNumberControl},
  { tester: materialHorizontalLayoutTester, renderer: MaterialHorizontalLayoutRenderer}
]



