import { Modal } from "./Modal";

const ROWS = [
  { size: "XS", bust: 32, waist: 26, hip: 35 },
  { size: "S", bust: 34, waist: 28, hip: 37 },
  { size: "M", bust: 36, waist: 30, hip: 39 },
  { size: "L", bust: 38, waist: 32, hip: 41 },
  { size: "XL", bust: 40, waist: 34, hip: 43 },
  { size: "XXL", bust: 42, waist: 36, hip: 45 },
];

export function SizeGuideDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Size guide"
      className="max-w-lg"
    >
      <h2 className="font-serif text-2xl text-stone-900">Size Guide</h2>
      <p className="mt-1 text-sm text-stone-500">
        Body measurements in inches. Between sizes? Take the larger one.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs tracking-wider text-stone-500 uppercase">
              <th className="py-2 pr-4 font-semibold">Size</th>
              <th className="py-2 pr-4 font-semibold">Bust</th>
              <th className="py-2 pr-4 font-semibold">Waist</th>
              <th className="py-2 font-semibold">Hip</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.size} className="border-b border-stone-100">
                <td className="py-2.5 pr-4 font-semibold text-stone-800">
                  {row.size}
                </td>
                <td className="py-2.5 pr-4 text-stone-600">{row.bust}"</td>
                <td className="py-2.5 pr-4 text-stone-600">{row.waist}"</td>
                <td className="py-2.5 text-stone-600">{row.hip}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="bg-maroon-50 mt-5 rounded-xl p-3 text-xs leading-relaxed text-stone-600">
        <strong className="font-semibold text-stone-800">
          How to measure:
        </strong>{" "}
        Bust at the fullest point, waist at the narrowest, hip 8" below the
        waist. Keep the tape snug, not tight.
      </p>
    </Modal>
  );
}
