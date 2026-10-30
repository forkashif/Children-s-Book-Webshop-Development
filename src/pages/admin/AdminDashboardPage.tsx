import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BookOpen, 
  Settings as SettingsIcon, 
  Terminal, 
  Mail, 
  LogOut, 
  RefreshCw, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Truck,
  RotateCcw,
  Sparkles,
  Eye,
  Send
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.js';
import type { Order, Book, BookVariant, StoreSettings } from '../../types/store.js';
import { bookCovers } from '../../server/sampleCovers.js';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateHome }) => {
  const { adminUser, logout, getAuthHeaders } = useAdminAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'books' | 'pod_logs' | 'emails' | 'settings'>('overview');

  // Dashboard Data
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    inProduction: 0,
    shippedOrders: 0,
    failedOrders: 0
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  const [podLogs, setPodLogs] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [previewEmailHtml, setPreviewEmailHtml] = useState<string | null>(null);

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // 1. Load Overview & Orders
  const loadDashboardData = () => {
    fetch('/api/admin/dashboard', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.recentOrders) setOrders(data.recentOrders);
        if (data.podLogs) setPodLogs(data.podLogs);
      })
      .catch(console.error);

    fetch('/api/admin/orders', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(console.error);

    fetch('/api/admin/books', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data);
      })
      .catch(console.error);

    fetch('/api/admin/settings', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);

    fetch('/api/admin/emails', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSentEmails(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      const matchEmail = o.customer_email.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchEmail) return false;
    }
    if (orderStatusFilter !== 'all' && o.pod_status !== orderStatusFilter) {
      return false;
    }
    return true;
  });

  // Action: Retry POD Submission
  const handleRetryPOD = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/retry-pod`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order ${orderId} successfully retransmitted to POD provider!`);
      } else {
        showNotification(`POD transmission failed: ${data.order?.pod_last_error || 'Check logs'}`);
      }
      loadDashboardData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(data.order);
      }
    } catch (e: any) {
      showNotification('Error retrying POD: ' + e.message);
    }
  };

  // Action: Simulate Status Transition (Admin can test status changes & customer alerts)
  const handleSimulateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/simulate-pod-status`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          carrier_name: 'An Post Tracked Priority'
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order ${orderId} status simulated to: ${status.toUpperCase()} (Email alert triggered)`);
        loadDashboardData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (e: any) {
      showNotification('Error updating status: ' + e.message);
    }
  };

  // Action: Resend Email
  const handleResendEmail = async (orderId: string, type: 'confirmation' | 'shipped') => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/resend-email`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      showNotification(data.message || `Resent ${type} email!`);
      loadDashboardData();
    } catch (e: any) {
      showNotification('Error sending email: ' + e.message);
    }
  };

  // Action: Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSaveSuccess(true);
        setTimeout(() => setSettingsSaveSuccess(false), 3000);
        showNotification('Store settings saved successfully!');
      }
    } catch (e: any) {
      showNotification('Failed to save settings: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E2538] pb-20">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#17181C] text-white sticky top-0 z-40 border-b border-[#E4DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-medium text-base tracking-tight">Starlight Press CMS</span>
            <span className="text-[10px] font-mono bg-[#2A2B30] text-[#E4DFD5] px-2 py-0.5 rounded-sm">
              POD: {(settings?.pod_provider || 'Prodigi').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-[#94A3B8]">
              Signed in as <strong>{adminUser?.email}</strong>
            </span>
            <button
              onClick={onNavigateHome}
              className="text-[#CBD5E1] hover:text-white transition-colors"
            >
              Public Store
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#333E5A] hover:bg-[#475569] text-white rounded-lg transition-colors font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-[#333E5A]/60 text-xs font-bold">
          {[
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { key: 'books', label: `Books & Pricing (${books.length})`, icon: BookOpen },
            { key: 'pod_logs', label: 'POD Logs', icon: Terminal },
            { key: 'emails', label: `Sent Emails (${sentEmails.length})`, icon: Mail },
            { key: 'settings', label: 'Store Settings', icon: SettingsIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2.5 px-3.5 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FAF7F2] text-[#1E2538] font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Floating Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2538] text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-[#333E5A] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs">
                <span className="text-xs text-[#8896AB] font-bold uppercase tracking-wider">Total Revenue</span>
                <div className="font-mono font-bold text-2xl text-[#1E2538] mt-1">
                  €{stats.totalRevenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-[#059669] font-semibold">Verified Stripe Payments</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs">
                <span className="text-xs text-[#8896AB] font-bold uppercase tracking-wider">Total Orders</span>
                <div className="font-mono font-bold text-2xl text-[#1E2538] mt-1">
                  {stats.totalOrders}
                </div>
                <span className="text-[11px] text-[#525F7A]">Lifetime customer orders</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs">
                <span className="text-xs text-[#8896AB] font-bold uppercase tracking-wider">In Print Lab</span>
                <div className="font-mono font-bold text-2xl text-[#D97706] mt-1">
                  {stats.inProduction}
                </div>
                <span className="text-[11px] text-[#D97706] font-semibold">Binding underway</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs">
                <span className="text-xs text-[#8896AB] font-bold uppercase tracking-wider">Shipped</span>
                <div className="font-mono font-bold text-2xl text-[#059669] mt-1">
                  {stats.shippedOrders}
                </div>
                <span className="text-[11px] text-[#059669] font-semibold">With postal courier</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs">
                <span className="text-xs text-[#8896AB] font-bold uppercase tracking-wider">POD Failures</span>
                <div className={`font-mono font-bold text-2xl mt-1 ${stats.failedOrders > 0 ? 'text-[#EF4444]' : 'text-[#8896AB]'}`}>
                  {stats.failedOrders}
                </div>
                <span className="text-[11px] text-[#8896AB]">
                  {stats.failedOrders > 0 ? 'Requires attention!' : 'All queues nominal'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="bg-white rounded-3xl border border-[#E8E0D2] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1ECE1]">
                <h2 className="font-display font-bold text-lg text-[#1E2538]">
                  Recent Customer Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#D97706] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E0D2] text-[#8896AB] uppercase text-[10px]">
                      <th className="pb-3">Order Ref</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Destination</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">POD Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1ECE1]">
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3 font-mono font-bold text-[#1E2538]">
                          {ord.id}
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-[#1E2538]">{ord.customer_name}</div>
                          <div className="text-[11px] text-[#8896AB]">{ord.customer_email}</div>
                        </td>
                        <td className="py-3 text-[#525F7A]">
                          {ord.shipping_address.city}, {ord.shipping_address.country_code}
                        </td>
                        <td className="py-3 font-mono font-bold text-[#1E2538]">
                          €{ord.total_amount.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.pod_status === 'shipped' || ord.pod_status === 'delivered'
                              ? 'bg-[#D1FAE5] text-[#065F46]'
                              : ord.pod_status === 'failed'
                              ? 'bg-[#FEE2E2] text-[#991B1B]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}>
                            {ord.pod_status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#1E2538] font-bold rounded-lg"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8E0D2] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[#8896AB] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order reference, customer name, email..."
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1E2538] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#525F7A]">POD Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl px-3 py-1.5 font-bold text-xs text-[#1E2538] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="sent_to_printer">Sent to Printer</option>
                  <option value="in_production">In Production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed Print Job</option>
                </select>
                <button
                  onClick={loadDashboardData}
                  className="p-2 text-[#525F7A] hover:text-[#1E2538] rounded-lg"
                  title="Refresh data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#E8E0D2] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8E0D2] text-[#8896AB] uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">POD Status</th>
                      <th className="p-4">Tracking Code</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1ECE1]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs text-[#8896AB]">
                          No orders match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF7F2]">
                          <td className="p-4 font-mono font-bold text-[#1E2538]">
                            {o.id}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-[#1E2538]">{o.customer_name}</div>
                            <div className="text-[11px] text-[#8896AB]">{o.customer_email}</div>
                          </td>
                          <td className="p-4 text-[#525F7A]">
                            {o.items?.length || 1} book{(o.items?.length || 1) > 1 ? 's' : ''}
                          </td>
                          <td className="p-4 font-mono font-bold text-[#1E2538]">
                            €{o.total_amount.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              o.pod_status === 'shipped' || o.pod_status === 'delivered'
                                ? 'bg-[#D1FAE5] text-[#065F46]'
                                : o.pod_status === 'failed'
                                ? 'bg-[#FEE2E2] text-[#991B1B]'
                                : 'bg-[#FEF3C7] text-[#92400E]'
                            }`}>
                              {o.pod_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[#525F7A]">
                            {o.tracking_number || <span className="text-[#8896AB]">Unassigned</span>}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 bg-[#1E2538] hover:bg-[#333E5A] text-white font-bold rounded-lg text-xs"
                            >
                              Inspect Order
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ORDER DETAIL & POD CONTROLLER MODAL */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8E0D2] max-h-[90vh] overflow-y-auto">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-start pb-4 border-b border-[#F1ECE1]">
                    <div>
                      <div className="text-xs text-[#8896AB]">Order Management View</div>
                      <h3 className="font-display font-bold text-xl text-[#1E2538] flex items-center gap-2">
                        <span>{selectedOrder.id}</span>
                        <span className="text-xs font-mono bg-[#FEF3C7] text-[#854D0E] px-2 py-0.5 rounded-md">
                          POD: {selectedOrder.pod_provider.toUpperCase()}
                        </span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-sm font-bold text-[#64748B] hover:text-[#1E2538] p-1"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#525F7A] bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE0D0]">
                    <div>
                      <strong className="text-[#1E2538] block mb-1">Customer Contact</strong>
                      <p>Name: <strong>{selectedOrder.customer_name}</strong></p>
                      <p>Email: {selectedOrder.customer_email}</p>
                      <p>Phone: {selectedOrder.customer_phone || 'None provided'}</p>
                    </div>

                    <div>
                      <strong className="text-[#1E2538] block mb-1">Postal Destination</strong>
                      <p>{selectedOrder.shipping_address.recipient_name}</p>
                      <p>{selectedOrder.shipping_address.address_line1}</p>
                      {selectedOrder.shipping_address.address_line2 && <p>{selectedOrder.shipping_address.address_line2}</p>}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}</p>
                      <p>{selectedOrder.shipping_address.country_code}</p>
                    </div>
                  </div>

                  {/* Line Items & Personal Dedication */}
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-sm text-[#1E2538]">
                      Books in this Order
                    </h4>
                    {(selectedOrder.items || []).map(item => (
                      <div key={item.id} className="p-3 bg-white rounded-xl border border-[#E8E0D2] flex justify-between gap-4 text-xs">
                        <div className="flex gap-3">
                          {item.cover_image && (
                            <img src={item.cover_image} alt="" className="w-12 h-16 object-cover rounded-md shrink-0" />
                          )}
                          <div>
                            <div className="font-display font-bold text-[#1E2538]">{item.book_title}</div>
                            <div className="text-[11px] text-[#525F7A]">Format: {item.format.toUpperCase()} · SKU: {item.sku}</div>
                            <div className="text-[11px] font-mono text-[#8896AB]">POD Product Code: {item.pod_product_code}</div>
                            {item.dedication_text && (
                              <div className="mt-1 p-2 bg-[#FFFBEB] rounded-lg border border-[#FDE68A] text-[11px] text-[#78350F] italic">
                                <strong>Personalized Dedication:</strong> "{item.dedication_text}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold">
                          €{item.total_price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* POD Control & Simulator Suite */}
                  <div className="p-5 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-[#1D4ED8]" />
                        <h4 className="font-display font-bold text-sm text-[#1E3A8A]">
                          Print-on-Demand Fulfillment Controls
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#1D4ED8]">
                        Status: {selectedOrder.pod_status.toUpperCase()}
                      </span>
                    </div>

                    {selectedOrder.pod_last_error && (
                      <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B]">
                        <strong>Last POD Error:</strong> {selectedOrder.pod_last_error}
                      </div>
                    )}

                    {/* Simulation buttons to test status changes & email dispatch */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-[#1E3A8A] uppercase">
                        Test Status Progression &amp; Webhook Simulation:
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <button
                          onClick={() => handleRetryPOD(selectedOrder.id)}
                          className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry POD Order</span>
                        </button>

                        <button
                          onClick={() => handleSimulateStatus(selectedOrder.id, 'in_production')}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F2] text-[#1E2538] border border-[#BFDBFE] font-bold rounded-lg"
                        >
                          Mark In Production
                        </button>

                        <button
                          onClick={() => handleSimulateStatus(selectedOrder.id, 'shipped')}
                          className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Mark as Shipped (Dispatches Email)</span>
                        </button>

                        <button
                          onClick={() => handleSimulateStatus(selectedOrder.id, 'delivered')}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F2] text-[#1E2538] border border-[#BFDBFE] font-bold rounded-lg"
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </div>

                    {/* Resend email options */}
                    <div className="pt-2 border-t border-[#BFDBFE]/60 flex gap-2">
                      <button
                        onClick={() => handleResendEmail(selectedOrder.id, 'confirmation')}
                        className="text-xs text-[#1D4ED8] hover:underline font-bold"
                      >
                        Resend Order Confirmation Email
                      </button>
                      <span className="text-[#BFDBFE]">·</span>
                      <button
                        onClick={() => handleResendEmail(selectedOrder.id, 'shipped')}
                        className="text-xs text-[#1D4ED8] hover:underline font-bold"
                      >
                        Resend Shipped Notification Email
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: BOOKS & PRICING MANAGEMENT */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-[#1E2538]">
                  Book Titles &amp; Pricing Management
                </h2>
                <p className="text-xs text-[#525F7A]">
                  Edit prices, sale prices, POD product codes, and print-ready PDF links per variant.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingBook(true)}
                className="px-4 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E2538] font-display font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map(b => (
                <div key={b.id} className="bg-white p-5 rounded-3xl border border-[#E8E0D2] shadow-xs space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={b.cover_image}
                      alt={b.title}
                      className="w-20 h-28 object-cover rounded-xl border border-[#E8E0D2] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display font-bold text-base text-[#1E2538] leading-tight">
                          {b.title}
                        </h3>
                        <button
                          onClick={() => setEditingBook(b)}
                          className="p-1.5 text-[#525F7A] hover:text-[#1E2538] hover:bg-[#FAF7F2] rounded-lg"
                          aria-label="Edit book"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#525F7A] mt-1">
                        By {b.author} · Illus. {b.illustrator}
                      </div>
                      <div className="text-[11px] text-[#8896AB] mt-0.5">
                        Category: {b.category} · Ages: {b.age_range} · {b.page_count} pages
                      </div>
                    </div>
                  </div>

                  {/* Variants and Pricing */}
                  <div className="pt-3 border-t border-[#F1ECE1] space-y-2 text-xs">
                    <span className="font-bold text-[#1E2538] uppercase text-[10px] tracking-wider block">
                      Active Variants &amp; POD Codes:
                    </span>
                    {(b.variants || []).map(v => (
                      <div key={v.id} className="p-2.5 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-[#1E2538]">{v.title}</strong>
                          <span className="text-[#8896AB] text-[11px] block font-mono">
                            SKU: {v.sku} · POD: {v.pod_product_code}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-[#1E2538]">
                            €{(v.sale_price || v.price).toFixed(2)}
                          </span>
                          {v.sale_price && (
                            <span className="text-[10px] text-[#059669] font-bold block">
                              (Sale from €{v.price.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setEditingBook(b)}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE0D0] text-[#1E2538] font-bold rounded-lg text-xs"
                    >
                      Edit Book &amp; Prices
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT BOOK MODAL */}
            {editingBook && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#E8E0D2] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-[#F1ECE1]">
                    <h3 className="font-display font-bold text-lg text-[#1E2538]">
                      Edit Book: {editingBook.title}
                    </h3>
                    <button
                      onClick={() => setEditingBook(null)}
                      className="text-sm font-bold text-[#64748B] hover:text-[#1E2538]"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch(`/api/admin/books/${editingBook.id}`, {
                        method: 'PUT',
                        headers: {
                          ...getAuthHeaders(),
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          book: editingBook,
                          variants: editingBook.variants
                        })
                      });
                      if (res.ok) {
                        showNotification('Book updated successfully!');
                        setEditingBook(null);
                        loadDashboardData();
                      }
                    } catch (err: any) {
                      showNotification('Error saving book: ' + err.message);
                    }
                  }} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1">Book Title</label>
                        <input
                          type="text"
                          value={editingBook.title}
                          onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Author</label>
                        <input
                          type="text"
                          value={editingBook.author}
                          onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                          className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingBook.description}
                        onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                      />
                    </div>

                    {/* Variant Pricing & Print File URLs */}
                    <div className="space-y-3 pt-2 border-t border-[#F1ECE1]">
                      <h4 className="font-display font-bold text-sm text-[#1E2538]">
                        Variant Pricing &amp; Print Files
                      </h4>

                      {(editingBook.variants || []).map((v, idx) => (
                        <div key={v.id || idx} className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE0D0] space-y-2">
                          <strong className="text-[#1E2538] block">{v.format.toUpperCase()} ({v.sku})</strong>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[11px] text-[#8896AB]">Regular Price (€)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.price}
                                onChange={(e) => {
                                  const updatedVars = [...(editingBook.variants || [])];
                                  updatedVars[idx].price = parseFloat(e.target.value) || 0;
                                  setEditingBook({ ...editingBook, variants: updatedVars });
                                }}
                                className="w-full bg-white border border-[#E8E0D2] rounded-lg p-2 font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-[#8896AB]">Sale Price (€ or empty)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={v.sale_price !== null ? v.sale_price : ''}
                                onChange={(e) => {
                                  const updatedVars = [...(editingBook.variants || [])];
                                  updatedVars[idx].sale_price = e.target.value ? parseFloat(e.target.value) : null;
                                  setEditingBook({ ...editingBook, variants: updatedVars });
                                }}
                                placeholder="None"
                                className="w-full bg-white border border-[#E8E0D2] rounded-lg p-2 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-[#8896AB]">POD Product Code</label>
                              <input
                                type="text"
                                value={v.pod_product_code}
                                onChange={(e) => {
                                  const updatedVars = [...(editingBook.variants || [])];
                                  updatedVars[idx].pod_product_code = e.target.value;
                                  setEditingBook({ ...editingBook, variants: updatedVars });
                                }}
                                className="w-full bg-white border border-[#E8E0D2] rounded-lg p-2 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-[#8896AB]">Print File URL (PDF)</label>
                            <input
                              type="text"
                              value={v.print_file_url}
                              onChange={(e) => {
                                const updatedVars = [...(editingBook.variants || [])];
                                updatedVars[idx].print_file_url = e.target.value;
                                setEditingBook({ ...editingBook, variants: updatedVars });
                              }}
                              className="w-full bg-white border border-[#E8E0D2] rounded-lg p-2 font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingBook(null)}
                        className="px-4 py-2 text-[#64748B] hover:text-[#1E2538]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E2538] font-bold rounded-xl"
                      >
                        Save Changes
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: POD INTEGRATION LOGS */}
        {activeTab === 'pod_logs' && (
          <div className="bg-white rounded-3xl border border-[#E8E0D2] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1ECE1]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#D97706]" />
                <h2 className="font-display font-bold text-lg text-[#1E2538]">
                  POD Transmission &amp; API Webhook Logs
                </h2>
              </div>
              <button onClick={loadDashboardData} className="text-xs font-bold text-[#D97706]">
                Refresh Logs
              </button>
            </div>

            <p className="text-xs text-[#525F7A]">
              Live inspection of automated communications sent to and received from Prodigi, Gelato, or Printful APIs.
            </p>

            <div className="space-y-3">
              {podLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8896AB]">
                  No POD transmission logs recorded yet.
                </div>
              ) : (
                podLogs.map(log => (
                  <div key={log.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          log.status === 'success' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'
                        }`}>
                          {log.status.toUpperCase()}
                        </span>
                        <strong className="text-[#1E2538] uppercase font-mono">{log.provider}</strong>
                        <span>· Action: {log.action}</span>
                      </div>
                      <span className="text-[11px] text-[#8896AB] font-mono">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#525F7A]">
                      Order Ref: <strong className="font-mono text-[#1E2538]">{log.order_id}</strong>
                    </div>

                    {log.response_payload && (
                      <pre className="p-2.5 bg-white rounded-xl border border-[#EAE0D0] font-mono text-[10px] overflow-x-auto text-[#334155]">
                        {log.response_payload}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SENT EMAILS */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-3xl border border-[#E8E0D2] p-6 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-lg text-[#1E2538]">
              Dispatched Transactional Emails
            </h2>
            <p className="text-xs text-[#525F7A]">
              Review the exact emails triggered automatically upon payment confirmation and postal carrier dispatch.
            </p>

            <div className="space-y-3">
              {sentEmails.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8896AB]">
                  No emails sent yet. Place an order to see confirmation emails!
                </div>
              ) : (
                sentEmails.map(em => (
                  <div key={em.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[#1E2538] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{em.subject}</span>
                      </div>
                      <div className="text-[11px] text-[#525F7A] mt-0.5">
                        To: <strong>{em.to}</strong> · Order: {em.order_id} · {new Date(em.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewEmailHtml(em.preview_html)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E8E0D2] rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Preview HTML</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Email Preview Modal */}
            {previewEmailHtml && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-[#E8E0D2] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-display font-bold text-sm text-[#1E2538]">Rendered Email Preview</h3>
                    <button onClick={() => setPreviewEmailHtml(null)} className="font-bold text-xs p-1">Close ✕</button>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: previewEmailHtml }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-[#E8E0D2] p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
            <h2 className="font-display font-bold text-xl text-[#1E2538]">
              Store &amp; POD Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold">Store Brand Name</label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold">Default Store Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5 font-bold"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">Primary POD Provider</label>
                <select
                  value={settings.pod_provider}
                  onChange={(e: any) => setSettings({ ...settings, pod_provider: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5 font-bold"
                >
                  <option value="prodigi">Prodigi (Recommended for Children's Books)</option>
                  <option value="gelato">Gelato</option>
                  <option value="printful">Printful</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">Free Shipping Threshold (€)</label>
                <input
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block font-bold">Contact Email Address</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block font-bold">Top Notice Announcement Banner Text</label>
                <input
                  type="text"
                  value={settings.notice_banner_text}
                  onChange={(e) => setSettings({ ...settings, notice_banner_text: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1ECE1] flex items-center justify-between">
              {settingsSaveSuccess && (
                <span className="text-xs font-bold text-[#059669]">
                  ✓ Settings saved successfully!
                </span>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E2538] font-bold text-xs rounded-xl shadow-xs ml-auto"
              >
                Save Store Settings
              </button>
            </div>
          </form>
        )}

      </main>

    </div>
  );
};
