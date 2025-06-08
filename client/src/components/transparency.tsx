import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, PiggyBank, Code, Users, Settings, BarChart3, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Transparency() {
  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["/api/financial-summary"],
  });

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["/api/expenses"],
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "fas fa-code": return Code;
      case "fas fa-users": return Users;
      case "fas fa-tools": return Settings;
      case "fas fa-chart-line": return BarChart3;
      default: return Code;
    }
  };

  const getIconBgColor = (category: string) => {
    switch (category) {
      case "infrastructure": return "bg-primary/10 text-primary";
      case "programs": return "bg-secondary/10 text-secondary";
      case "operations": return "bg-accent/10 text-accent";
      case "marketing": return "bg-yellow-100 text-yellow-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  const calculatePercentage = (amount: string, total: number) => {
    const amountNum = parseFloat(amount);
    return total > 0 ? ((amountNum / total) * 100).toFixed(1) : "0.0";
  };

  if (isLoadingSummary || isLoadingExpenses) {
    return (
      <section id="transparency" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </section>
    );
  }

  const totalAllocated = financialSummary?.totalAllocated || 0;

  return (
    <section id="transparency" className="py-20 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Financial Transparency</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how your donations are used. Real-time tracking and complete financial transparency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-lg bg-gray-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Raised</h3>
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
               ₹{financialSummary ? financialSummary.totalRaised.toLocaleString() : "0"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-secondary">↗ 1%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-gray-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Funds Allocated</h3>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹{financialSummary ? financialSummary.totalAllocated.toLocaleString() : "0"}
              </div>
              <div className="text-sm text-gray-600">
                {financialSummary && financialSummary.totalRaised > 0 
                  ? ((financialSummary.totalAllocated / financialSummary.totalRaised) * 100).toFixed(1)
                  : "0"
                }% of total raised
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg bg-gray-100">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Available Balance</h3>
                <PiggyBank className="w-6 h-6 text-accent" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹{financialSummary ? financialSummary.availableBalance.toLocaleString() : "0"}
              </div>
              <div className="text-sm text-gray-600">
                Ready for deployment
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-lg bg-gray-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Expense Breakdown</h3>
            <div className="space-y-6">
              {expenses && expenses.map((expense) => {
                const IconComponent = getIconComponent(expense.icon);
                const iconClasses = getIconBgColor(expense.category);
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${iconClasses} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{expense.name}</div>
                        <div className="text-sm text-gray-600">{expense.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">${parseFloat(expense.amount).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{calculatePercentage(expense.amount, totalAllocated)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Info className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">Transparency Commitment</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All financial data is updated in real-time and audited monthly by independent accountants. 
                Complete transaction history and receipts are available upon request.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
