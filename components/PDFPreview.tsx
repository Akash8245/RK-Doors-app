import { Estimate } from "@/types/estimate";
import rkDoorsLogo from "../assets/images/main-blue.png";

interface PDFPreviewProps {
  estimate: Estimate;
}

export const PDFPreview = ({ estimate }: PDFPreviewProps) => {
  return (
    <div id="pdf-content" className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 min-h-[297mm]">
      <div className="max-w-[210mm] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header - Blue Theme */}
        <div className="bg-gradient-to-r from-[#1E5BA8]/85 to-[#2B6BBE]/85 px-8 py-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4 pl-2 pt-1">
              <img src={rkDoorsLogo} alt="RK Doors" className="h-16 object-contain mr-4 block" />
            </div>
            <div className="border border-white/30 rounded-lg px-6 py-3 bg-white/10">
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-white/80 mb-1">Date</p>
                  <p className="text-white font-semibold">{new Date(estimate.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-white/80 mb-1">No</p>
                  <p className="text-white font-semibold">{estimate.estimateNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ESTIMATE Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-wider">ESTIMATE</h1>
          </div>
        </div>

        {/* Client Info */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">TO:</span>
            <span className="ml-3 text-slate-900 font-medium">{estimate.clientName}</span>
          </p>
        </div>

        {/* Items Table */}
        <div className="px-8 py-6">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1E5BA8]/85 text-white">
                  <th className="text-left py-3 px-4 text-sm font-semibold w-16">SI</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Description</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold w-20">Pic</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold w-32">Design Number</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold w-24">Size</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold w-24">Sq.Ft.</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold w-24">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold w-32">Total Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {estimate.items.map((item, index) => (
                  <tr key={item.id} className={index !== estimate.items.length - 1 ? "border-b border-slate-200" : ""}>
                    <td className="py-4 px-4 text-sm text-slate-900">{item.si}</td>
                    <td className="py-4 px-4 text-sm text-slate-900 font-medium">{item.description}</td>
                    <td className="py-4 px-4 text-center">
                      {item.picture && (
                        <img 
                          src={item.picture} 
                          alt={item.description}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 mx-auto"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-slate-700 font-medium">{item.designNumber}</td>
                    <td className="py-4 px-4 text-center text-sm text-slate-700">{item.size}</td>
                    <td className="py-4 px-4 text-center text-sm text-slate-700">{item.squareFeet ?? ''}</td>
                    <td className="py-4 px-4 text-center text-sm text-slate-900">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-sm text-slate-900 font-semibold">₹ {item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="px-8 pb-8">
          <div className="flex justify-end">
            <div className="w-80 bg-slate-50 rounded-lg p-6 space-y-4 border border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sub Total</span>
                <span className="text-slate-900 font-semibold">₹ {estimate.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="text-slate-900 font-semibold">₹ {estimate.discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-slate-300">
                <div className="bg-[#1E5BA8]/85 text-white rounded-lg p-4 flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-2xl font-bold">₹ {estimate.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
