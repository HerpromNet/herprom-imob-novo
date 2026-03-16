export enum PlanType {
    FREE_TRIAL = 'Teste Gratuito',
    PRO = 'Pro',
    MASTER_ADMIN = 'Master Admin'
}

export enum SubscriptionStatus {
    ACTIVE = 'Ativo',
    INACTIVE = 'Inativo',
    PENDING = 'Pendente'
}

export interface UserAccount {
    id: string;
    email: string;
    name: string;
    creci?: string;
    plan: PlanType;
    status: SubscriptionStatus;
    trialDaysLeft: number;
    earningsBalance: number;
    isAdmin: boolean;
}
