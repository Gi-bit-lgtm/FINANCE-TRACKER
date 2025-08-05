// MyFinances Application JavaScript with Indian Rupee Support

class MyFinancesApp {
    constructor() {
        // Initialize data storage with Indian sample data
        this.transactions = [
            {
                id: 1,
                date: "2025-08-01",
                amount: 75000,
                type: "income",
                category: "Salary",
                description: "Monthly salary",
                source: "Company"
            },
            {
                id: 2,
                date: "2025-08-02",
                amount: 3500,
                type: "expense",
                category: "Food",
                description: "Monthly groceries",
                source: "Big Bazaar"
            },
            {
                id: 3,
                date: "2025-08-03",
                amount: 1200,
                type: "expense",
                category: "Transport",
                description: "Metro card recharge",
                source: "Delhi Metro"
            },
            {
                id: 4,
                date: "2025-08-04",
                amount: 25000,
                type: "expense",
                category: "Bills",
                description: "Monthly rent",
                source: "Landlord"
            },
            {
                id: 5,
                date: "2025-08-05",
                amount: 2000,
                type: "expense",
                category: "Entertainment",
                description: "Movie and dinner",
                source: "PVR Cinemas"
            },
            {
                id: 6,
                date: "2025-08-06",
                amount: 850,
                type: "expense",
                category: "Food",
                description: "Lunch at office",
                source: "Office Canteen"
            },
            {
                id: 7,
                date: "2025-08-07",
                amount: 15000,
                type: "income",
                category: "Freelance",
                description: "Website development project",
                source: "Freelance Client"
            }
        ];

        this.budgets = [
            {category: "Food", limit: 8000, icon: "🍽️"},
            {category: "Transport", limit: 3000, icon: "🚗"},
            {category: "Entertainment", limit: 5000, icon: "🎬"},
            {category: "Bills", limit: 30000, icon: "📄"},
            {category: "Shopping", limit: 10000, icon: "🛍️"},
            {category: "Healthcare", limit: 5000, icon: "🏥"},
            {category: "Other", limit: 3000, icon: "📦"}
        ];

        this.currency = {
            symbol: "₹",
            code: "INR",
            name: "Indian Rupee"
        };
        
        this.nextId = 8;
        this.currentView = 'dashboard';
        this.charts = {};

        // Initialize when DOM is ready
        this.init();
    }

    init() {
        console.log('Initializing MyFinances App...');
        this.setupEventListeners();
        this.populateCategories();
        this.updateDashboard();
        this.renderTransactions();
        this.renderBudgets();
        this.setCurrentDate();
        console.log('App initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation - Use more robust event handling
        const navItems = document.querySelectorAll('.nav__item');
        console.log('Found nav items:', navItems.length);
        
        navItems.forEach((item, index) => {
            const view = item.getAttribute('data-view');
            console.log(`Setting up nav item ${index}: ${view}`);
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Nav item clicked:', view);
                this.switchView(view);
            });
        });

        // Modal controls
        const addTransactionBtn = document.getElementById('addTransactionBtn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                console.log('Add transaction button clicked');
                this.openModal();
            });
        } else {
            console.warn('Add transaction button not found');
        }

        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        const modalBackdrop = document.querySelector('.modal__backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.closeModal());
        }

        // Form submission
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Filters
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterTransactions());
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterTransactions());
        }

        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.addEventListener('input', () => this.filterTransactions());
        }

        // Transaction type change
        const transactionType = document.getElementById('transactionType');
        if (transactionType) {
            transactionType.addEventListener('change', (e) => this.updateCategoryOptions(e.target.value));
        }

        console.log('Event listeners setup completed');
    }

    switchView(view) {
        console.log('Switching to view:', view);
        
        // Update navigation active state
        document.querySelectorAll('.nav__item').forEach(item => {
            item.classList.remove('nav__item--active');
        });
        
        const activeNavItem = document.querySelector(`[data-view="${view}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('nav__item--active');
            console.log('Updated active nav item');
        } else {
            console.warn('Active nav item not found for view:', view);
        }

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('view--active');
        });
        
        const targetView = document.getElementById(view);
        if (targetView) {
            targetView.classList.add('view--active');
            console.log('Activated view:', view);
        } else {
            console.error('Target view not found:', view);
            return;
        }

        this.currentView = view;

        // Update view-specific content with delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Updating content for view:', view);
            if (view === 'dashboard') {
                this.updateDashboard();
            } else if (view === 'transactions') {
                this.renderTransactions();
            } else if (view === 'budget') {
                this.renderBudgets();
            } else if (view === 'reports') {
                this.renderReports();
            }
        }, 50);
    }

    updateDashboard() {
        console.log('Updating dashboard...');
        this.updateStats();
        this.renderRecentTransactions();
        setTimeout(() => this.renderDashboardCharts(), 200);
    }

    updateStats() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = this.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = this.transactions
            .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

        const monthlySavings = monthlyIncome - monthlyExpenses;

        const totalBalanceEl = document.getElementById('totalBalance');
        const monthlyIncomeEl = document.getElementById('monthlyIncome');
        const monthlyExpensesEl = document.getElementById('monthlyExpenses');
        const monthlySavingsEl = document.getElementById('monthlySavings');

        if (totalBalanceEl) totalBalanceEl.textContent = this.formatCurrency(totalBalance);
        if (monthlyIncomeEl) monthlyIncomeEl.textContent = this.formatCurrency(monthlyIncome);
        if (monthlyExpensesEl) monthlyExpensesEl.textContent = this.formatCurrency(monthlyExpenses);
        if (monthlySavingsEl) monthlySavingsEl.textContent = this.formatCurrency(monthlySavings);
    }

    renderRecentTransactions() {
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const container = document.getElementById('recentTransactionsList');
        if (!container) return;
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📝</div><h3>No transactions yet</h3><p>Start by adding your first transaction</p></div>';
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => 
            this.createTransactionHTML(transaction, false)
        ).join('');
    }

    renderDashboardCharts() {
        // Destroy existing charts
        if (this.charts.expense) {
            this.charts.expense.destroy();
            this.charts.expense = null;
        }
        if (this.charts.incomeExpense) {
            this.charts.incomeExpense.destroy();
            this.charts.incomeExpense = null;
        }

        this.renderExpenseChart();
        this.renderIncomeExpenseChart();
    }

    renderExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const expenseData = this.getExpenseByCategory();

        if (expenseData.labels.length === 0) {
            return;
        }

        this.charts.expense = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: expenseData.labels,
                datasets: [{
                    data: expenseData.data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderIncomeExpenseChart() {
        const canvas = document.getElementById('incomeExpenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const monthlyData = this.getMonthlyIncomeExpense();

        this.charts.incomeExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [monthlyData.income, monthlyData.expenses],
                    backgroundColor: ['#10B981', '#EF4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    renderTransactions() {
        console.log('Rendering transactions page...');
        this.populateFilters();
        this.filterTransactions();
    }

    populateFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;
        
        const categories = [...new Set(this.transactions.map(t => t.category))];
        
        categoryFilter.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    filterTransactions() {
        const typeFilter = document.getElementById('typeFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const searchFilter = document.getElementById('searchFilter');

        const typeValue = typeFilter ? typeFilter.value : '';
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const searchValue = searchFilter ? searchFilter.value.toLowerCase() : '';

        let filteredTransactions = this.transactions.filter(transaction => {
            const matchesType = !typeValue || transaction.type === typeValue;
            const matchesCategory = !categoryValue || transaction.category === categoryValue;
            const matchesSearch = !searchValue || 
                transaction.description.toLowerCase().includes(searchValue) ||
                transaction.category.toLowerCase().includes(searchValue) ||
                transaction.source.toLowerCase().includes(searchValue);

            return matchesType && matchesCategory && matchesSearch;
        });

        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        const container = document.getElementById('transactionsList');
        if (!container) return;
        
        if (filteredTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🔍</div><h3>No transactions found</h3><p>Try adjusting your filters</p></div>';
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => 
            this.createTransactionHTML(transaction, true)
        ).join('');

        // Add delete event listeners
        container.querySelectorAll('.transaction-item__action--delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.transaction-item').dataset.id);
                this.deleteTransaction(id);
            });
        });
    }

    createTransactionHTML(transaction, showActions = false) {
        const isIncome = transaction.type === 'income';
        const formattedAmount = this.formatCurrency(transaction.amount);
        const formattedDate = this.formatDate(transaction.date);

        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-item__left">
                    <div class="transaction-item__icon transaction-item__icon--${transaction.type}">
                        ${isIncome ? '📈' : '📉'}
                    </div>
                    <div class="transaction-item__details">
                        <h4>${transaction.description}</h4>
                        <p>${transaction.category} • ${transaction.source}</p>
                    </div>
                </div>
                <div class="transaction-item__right">
                    <div class="transaction-item__amount transaction-item__amount--${transaction.type}">
                        ${isIncome ? '+' : '-'}${formattedAmount}
                    </div>
                    <div class="transaction-item__date">${formattedDate}</div>
                    ${showActions ? `
                        <div class="transaction-item__actions">
                            <button class="transaction-item__action transaction-item__action--delete">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderBudgets() {
        console.log('Rendering budgets page...');
        const container = document.getElementById('budgetGrid');
        if (!container) return;
        
        const budgetData = this.getBudgetData();

        container.innerHTML = this.budgets.map(budget => {
            const spent = budgetData[budget.category] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const status = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'good';

            return `
                <div class="budget-card">
                    <div class="budget-card__header">
                        <div class="budget-card__icon">${budget.icon}</div>
                        <h3 class="budget-card__title">${budget.category}</h3>
                    </div>
                    <div class="budget-card__amounts">
                        <span class="budget-card__spent">${this.formatCurrency(spent)}</span>
                        <span class="budget-card__limit">of ${this.formatCurrency(budget.limit)}</span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress__bar budget-progress__bar--${status}" style="width: ${percentage}%"></div>
                    </div>
                    <button class="budget-card__edit" onclick="app.editBudget('${budget.category}')">
                        Edit Budget
                    </button>
                </div>
            `;
        }).join('');
    }

    renderReports() {
        console.log('Rendering reports page...');
        // Destroy existing charts
        if (this.charts.trend) {
            this.charts.trend.destroy();
            this.charts.trend = null;
        }
        if (this.charts.budget) {
            this.charts.budget.destroy();
            this.charts.budget = null;
        }

        setTimeout(() => {
            this.renderTrendChart();
            this.renderBudgetChart();
        }, 200);
    }

    renderTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const trendData = this.getTrendData();

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [{
                    label: 'Expenses',
                    data: trendData.expenses,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Income',
                    data: trendData.income,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    renderBudgetChart() {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const budgetData = this.getBudgetData();

        const labels = this.budgets.map(b => b.category);
        const budgetLimits = this.budgets.map(b => b.limit);
        const actualSpending = this.budgets.map(b => budgetData[b.category] || 0);

        this.charts.budget = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Budget',
                    data: budgetLimits,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: '#3B82F6',
                    borderWidth: 1
                }, {
                    label: 'Actual',
                    data: actualSpending,
                    backgroundColor: 'rgba(239, 68, 68, 0.5)',
                    borderColor: '#EF4444',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    openModal() {
        console.log('Opening modal...');
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.remove('hidden');
            const form = document.getElementById('transactionForm');
            if (form) form.reset();
            this.setCurrentDate();
            this.updateCategoryOptions('');
        }
    }

    closeModal() {
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const transaction = {
            id: this.nextId++,
            type: document.getElementById('transactionType').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            category: document.getElementById('transactionCategory').value,
            date: document.getElementById('transactionDate').value,
            description: document.getElementById('transactionDescription').value,
            source: document.getElementById('transactionSource').value || 'N/A'
        };

        this.transactions.push(transaction);
        this.closeModal();
        this.showToast('Transaction added successfully!', 'success');
        
        // Update current view
        if (this.currentView === 'dashboard') {
            this.updateDashboard();
        } else if (this.currentView === 'transactions') {
            this.renderTransactions();
        } else if (this.currentView === 'budget') {
            this.renderBudgets();
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.showToast('Transaction deleted successfully!', 'success');
            
            // Update current view
            if (this.currentView === 'dashboard') {
                this.updateDashboard();
            } else if (this.currentView === 'transactions') {
                this.renderTransactions();
            } else if (this.currentView === 'budget') {
                this.renderBudgets();
            }
        }
    }

    editBudget(category) {
        const budget = this.budgets.find(b => b.category === category);
        const newLimit = prompt(`Enter new budget limit for ${category} (₹):`, budget.limit);
        
        if (newLimit && !isNaN(newLimit) && newLimit > 0) {
            budget.limit = parseFloat(newLimit);
            this.renderBudgets();
            this.showToast('Budget updated successfully!', 'success');
        }
    }

    populateCategories() {
        const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'];
        const expenseCategories = this.budgets.map(b => b.category);

        // Store categories for later use
        this.incomeCategories = incomeCategories;
        this.expenseCategories = expenseCategories;
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transactionCategory');
        if (!categorySelect) return;
        
        let categories = [];

        if (type === 'income') {
            categories = this.incomeCategories;
        } else if (type === 'expense') {
            categories = this.expenseCategories;
        }

        categorySelect.innerHTML = '<option value="">Select category</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    setCurrentDate() {
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    // Utility methods with Indian Rupee formatting
    formatCurrency(amount) {
        // Indian number formatting with crores, lakhs
        const absAmount = Math.abs(amount);
        let formattedNumber;
        
        if (absAmount >= 10000000) {
            // Crores
            formattedNumber = (absAmount / 10000000).toLocaleString('en-IN', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            }) + ' Cr';
        } else if (absAmount >= 100000) {
            // Lakhs
            formattedNumber = (absAmount / 100000).toLocaleString('en-IN', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            }) + ' L';
        } else {
            // Regular formatting with Indian comma placement
            formattedNumber = absAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
        
        return `₹${formattedNumber}`;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getExpenseByCategory() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return {
            labels: Object.keys(categoryTotals),
            data: Object.values(categoryTotals)
        };
    }

    getMonthlyIncomeExpense() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = this.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { income, expenses };
    }

    getBudgetData() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyExpenses = this.transactions.filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' && 
                   date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear;
        });

        const categoryTotals = {};
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return categoryTotals;
    }

    getTrendData() {
        // Get last 6 months of data
        const months = [];
        const income = [];
        const expenses = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months.push(month);

            const monthTransactions = this.transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
            });

            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthExpenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            income.push(monthIncome);
            expenses.push(monthExpenses);
        }

        return { labels: months, income, expenses };
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    window.app = new MyFinancesApp();
});