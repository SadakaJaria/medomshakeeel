import ZakatCalculator from '../components/tools/ZakatCalculator'
import PurificationCalculator from '../components/tools/PurificationCalculator'

function Tools() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">الأدوات</h1>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ZakatCalculator />
        <PurificationCalculator />
      </div>
    </div>
  )
}

export default Tools
