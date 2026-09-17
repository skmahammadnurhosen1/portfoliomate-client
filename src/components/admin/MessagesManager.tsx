import React, { useState } from 'react';
import { 
  Mail, 
  Trash2, 
  Check, 
  Clock, 
  Search, 
  ExternalLink, 
  Inbox, 
  MessageSquare, 
  RefreshCw 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface MessagesManagerProps {
  onShowToast: (msg: string) => void;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({ onShowToast }) => {
  const { messages, markMessageRead, deleteMessage, fetchMessages, unreadCount } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMessages();
    setIsRefreshing(false);
    onShowToast('Inbox refreshed.');
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    await markMessageRead(id, !currentRead);
    onShowToast(`Message marked as ${!currentRead ? 'read' : 'unread'}.`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(id);
      if (selectedMessageId === id) setSelectedMessageId(null);
      onShowToast('Message deleted successfully.');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.lastName && msg.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'unread') return !msg.isRead;
    if (filterStatus === 'read') return msg.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Visitor Inquiries
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-[#d6ad60] border border-amber-500/25">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Review and respond to messages submitted through the public website contact form.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-outfit font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60] text-neutral-800 dark:text-neutral-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by sender, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#d6ad60]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto self-start">
          {(['all', 'unread', 'read'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-outfit font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
          <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="font-outfit font-bold text-sm text-neutral-800 dark:text-neutral-200">
            No inquiries found
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            {messages.length === 0
              ? 'When visitors fill out the contact form on your website, their messages will appear here.'
              : 'No messages match your current filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isSelected = selectedMessageId === msg._id;
            const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg._id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  !msg.isRead
                    ? 'bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/30'
                    : 'bg-white dark:bg-[#12100e] border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
                  <div className="flex items-center gap-2.5">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" title="Unread Message" />
                    )}
                    <span className="font-outfit font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                      {msg.firstName} {msg.lastName || ''}
                    </span>
                    <a
                      href={`mailto:${msg.email}?subject=Reply to your portfolio inquiry`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#c5a059] dark:text-[#d6ad60] hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{msg.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {msg.phone && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 pb-2">
                    Phone: <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                  </div>
                )}

                {/* Message Body */}
                <div className="mt-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed bg-neutral-50 dark:bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
                  {msg.message}
                </div>

                {/* Action Buttons */}
                <div className="mt-3.5 flex items-center justify-end gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Your inquiry on NOOR Portfolio`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-[#c5a059] dark:hover:bg-[#d6ad60] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg._id, msg.isRead)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{msg.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
