'use client';

interface LeaveBalances {
  available: number;
  consumed: number;
  accruedSoFar: number;
  carryover: number;
  annualQuota: number;
}

interface LeaveDetailComponentProps {
  leaveBalances: LeaveBalances;
}

export const LeaveDetailComponent = ({
  leaveBalances,
}: LeaveDetailComponentProps) => {
  return (
    <div className='grid grid-cols-5 gap-4 p-5 border border-[var(--border-dark)] rounded-md'>
      <div className=''>
        <div className='text-sm text-[var(--text-secondary)]'>Available</div>
        <div className='text-sm font-medium text-[var(--text-dark)]'>
          {leaveBalances.available} days
        </div>
      </div>
      <div className=''>
        <div className='text-sm text-[var(--text-secondary)]'>Consumed</div>
        <div className='text-sm font-medium text-[var(--text-dark)]'>
          {leaveBalances.consumed} days
        </div>
      </div>
      <div className=''>
        <div className='text-sm text-[var(--text-secondary)]'>
          Accrued so far
        </div>
        <div className='text-sm font-medium text-[var(--text-dark)]'>
          {leaveBalances.accruedSoFar} days
        </div>
      </div>
      <div className=''>
        <div className='text-sm text-[var(--text-secondary)]'>Carryover</div>
        <div className='text-sm font-medium text-[var(--text-dark)]'>
          {leaveBalances.carryover} days
        </div>
      </div>
      <div className=''>
        <div className='text-sm text-[var(--text-secondary)]'>Annual Quota</div>
        <div className='text-sm font-medium text-[var(--text-dark)]'>
          {leaveBalances.annualQuota} days
        </div>
      </div>
    </div>
  );
};
