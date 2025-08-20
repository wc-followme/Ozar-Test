// 🎯 Frontend Estimation Calculation Utilities
// This file implements the exact same calculation logic as the backend

export const MARKUP_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FLAT_AMOUNT: 'FLAT_AMOUNT',
} as const;

export type MarkupType = (typeof MARKUP_TYPES)[keyof typeof MARKUP_TYPES];

// Utility function to safely convert values to numbers
export const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Check if item should be included in calculations
export const shouldIncludeInCalculation = (item: {
  is_hidden?: boolean;
}): boolean => {
  return !item.is_hidden;
};

// 1. Line Total Calculations
export const calculateLineTotal = (rate: number, qty: number): number => {
  return safeNumber(rate) * safeNumber(qty);
};

// 2. Service Total Calculations
export const calculateServiceTotal = (rate: number, qty: number): number => {
  return calculateLineTotal(rate, qty);
};

export const calculateServiceTotalWithMaterials = (
  serviceTotal: number,
  materialCosts: number
): number => {
  return safeNumber(serviceTotal) + safeNumber(materialCosts);
};

// 3. Material Cost Calculations
export const calculateMaterialCost = (material: {
  rate: number;
  qty: number;
  is_hidden?: boolean;
}): number => {
  if (!shouldIncludeInCalculation(material)) {
    return 0;
  }
  return calculateLineTotal(material.rate, material.qty);
};

export const calculateServiceMaterialCost = (
  materials: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
  }>
): number => {
  return materials.reduce((total, material) => {
    return total + calculateMaterialCost(material);
  }, 0);
};

export const calculateServiceFinishCost = (
  finishes: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
  }>
): number => {
  return finishes.reduce((total, finish) => {
    return total + calculateMaterialCost(finish);
  }, 0);
};

export const calculateServiceTotalMaterialCost = (
  materials: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
  }>,
  finishes: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
  }> = []
): number => {
  const materialCost = calculateServiceMaterialCost(materials);
  const finishCost = calculateServiceFinishCost(finishes);
  return materialCost + finishCost;
};

export const calculateTradeMaterialCost = (
  services: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
    materials?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
    }>;
    finishes?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
    }>;
  }>
): number => {
  return services.reduce((tradeTotal, service) => {
    if (!shouldIncludeInCalculation(service)) {
      return tradeTotal;
    }
    const serviceMaterialCost = calculateServiceTotalMaterialCost(
      service.materials || [],
      service.finishes || []
    );
    return tradeTotal + serviceMaterialCost;
  }, 0);
};

// 4. Labor Cost Calculations
export const calculateServiceLaborCost = (service: {
  rate: number;
  qty: number;
  is_hidden?: boolean;
}): number => {
  if (!shouldIncludeInCalculation(service)) {
    return 0;
  }
  return calculateLineTotal(service.rate, service.qty);
};

export const calculateTradeLaborCost = (
  services: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
  }>
): number => {
  return services.reduce((total, service) => {
    return total + calculateServiceLaborCost(service);
  }, 0);
};

// 5. Markup Calculations
export const calculateMarkupValue = (trade: {
  markup_type?: MarkupType;
  markup?: number;
  services?: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
    materials?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
      markup?: number;
      markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
    }>;
    finishes?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
      markup?: number;
      markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
    }>;
  }>;
}): number => {
  const {
    markup_type = MARKUP_TYPES.FLAT_AMOUNT,
    markup = 0,
    services = [],
  } = trade;

  if (markup_type === MARKUP_TYPES.PERCENTAGE && services.length > 0) {
    // Percentage markup: calculate as percentage of (rate * qty) for all materials and finishes
    return services.reduce((total, service) => {
      if (!shouldIncludeInCalculation(service)) {
        return total;
      }

      // Calculate markup for materials
      const materialMarkup = (service.materials || []).reduce(
        (materialTotal, material) => {
          if (!shouldIncludeInCalculation(material)) {
            return materialTotal;
          }
          const materialCost = calculateMaterialCost(material);
          return materialTotal + materialCost * (safeNumber(markup) / 100);
        },
        0
      );

      // Calculate markup for finishes
      const finishMarkup = (service.finishes || []).reduce(
        (finishTotal, finish) => {
          if (!shouldIncludeInCalculation(finish)) {
            return finishTotal;
          }
          const finishCost = calculateMaterialCost(finish);
          return finishTotal + finishCost * (safeNumber(markup) / 100);
        },
        0
      );

      return total + materialMarkup + finishMarkup;
    }, 0);
  } else if (services.length > 0) {
    // Check if there are any materials or finishes with markup fields (including 0)
    const hasIndividualMarkupFields = services.some(service => {
      const hasMaterialMarkupFields = (service.materials || []).some(material =>
        material.hasOwnProperty('markup')
      );
      const hasFinishMarkupFields = (service.finishes || []).some(finish =>
        finish.hasOwnProperty('markup')
      );
      return hasMaterialMarkupFields || hasFinishMarkupFields;
    });

    if (hasIndividualMarkupFields) {
      // Flat amount markup: sum of individual material and finish markups (including 0 values)
      return services.reduce((total, service) => {
        if (!shouldIncludeInCalculation(service)) {
          return total;
        }

        // Sum material markups
        const materialMarkup = (service.materials || []).reduce(
          (materialTotal, material) => {
            if (!shouldIncludeInCalculation(material)) {
              return materialTotal;
            }
            const markupValue = safeNumber(material.markup || 0);
            const markupType = material.markup_type || 'FLAT_AMOUNT';

            if (markupType === 'PERCENTAGE') {
              // Calculate percentage of the material cost (qty * rate)
              const materialCost = calculateMaterialCost(material);
              return materialTotal + (materialCost * markupValue) / 100;
            } else {
              // Flat amount markup
              return materialTotal + markupValue;
            }
          },
          0
        );

        // Sum finish markups
        const finishMarkup = (service.finishes || []).reduce(
          (finishTotal, finish) => {
            if (!shouldIncludeInCalculation(finish)) {
              return finishTotal;
            }
            const markupValue = safeNumber(finish.markup || 0);
            const markupType = finish.markup_type || 'FLAT_AMOUNT';

            if (markupType === 'PERCENTAGE') {
              // Calculate percentage of the finish cost (qty * rate)
              const finishCost = calculateMaterialCost(finish);
              return finishTotal + (finishCost * markupValue) / 100;
            } else {
              // Flat amount markup
              return finishTotal + markupValue;
            }
          },
          0
        );

        return total + materialMarkup + finishMarkup;
      }, 0);
    } else {
      // Trade-level flat amount markup: use the trade markup value directly
      return safeNumber(markup);
    }
  }
  return 0;
};

// 6. Trade Total Calculations
export const calculateTradeTotal = (trade: {
  markup_type?: MarkupType;
  markup?: number;
  services?: Array<{
    rate: number;
    qty: number;
    is_hidden?: boolean;
    materials?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
      markup?: number;
      markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
    }>;
    finishes?: Array<{
      rate: number;
      qty: number;
      is_hidden?: boolean;
      markup?: number;
      markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
    }>;
  }>;
}): {
  labor_cost: number;
  material_cost: number;
  markup: number;
  trade_total: number;
} => {
  const services = trade.services || [];
  const laborCost = calculateTradeLaborCost(services);
  const materialCost = calculateTradeMaterialCost(services);
  const markupValue = calculateMarkupValue(trade);

  return {
    labor_cost: laborCost,
    material_cost: materialCost,
    markup: markupValue,
    trade_total: laborCost + materialCost + markupValue,
  };
};

// 7. Job Total Calculations
export const calculateJobTotal = (
  jobRooms: Array<{
    trades?: Array<{
      markup_type?: MarkupType;
      markup?: number;
      services?: Array<{
        rate: number;
        qty: number;
        is_hidden?: boolean;
        materials?: Array<{
          rate: number;
          qty: number;
          is_hidden?: boolean;
          markup?: number;
          markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
        }>;
        finishes?: Array<{
          rate: number;
          qty: number;
          is_hidden?: boolean;
          markup?: number;
          markup_type?: 'PERCENTAGE' | 'FLAT_AMOUNT';
        }>;
      }>;
    }>;
  }>
): {
  labor_cost: number;
  material_cost: number;
  markup: number;
  trade_total: number;
} => {
  let totalLaborCost = 0;
  let totalMaterialCost = 0;
  let totalMarkup = 0;

  jobRooms.forEach(room => {
    const trades = room.trades || [];
    trades.forEach(trade => {
      const tradeTotals = calculateTradeTotal(trade);
      totalLaborCost += tradeTotals.labor_cost;
      totalMaterialCost += tradeTotals.material_cost;
      totalMarkup += tradeTotals.markup;
    });
  });

  return {
    labor_cost: totalLaborCost,
    material_cost: totalMaterialCost,
    markup: totalMarkup,
    trade_total: totalLaborCost + totalMaterialCost + totalMarkup,
  };
};

// Real-time calculation updates
export const updateCalculations = (jobRooms: any[]): any[] => {
  return jobRooms.map(room => ({
    ...room,
    trades: room.trades?.map((trade: any) => {
      const tradeTotals = calculateTradeTotal(trade);

      return {
        ...trade,
        services: trade.services?.map((service: any) => ({
          ...service,
          service_total: calculateServiceTotal(service.rate, service.qty),
          line_total: calculateServiceTotal(service.rate, service.qty),
          material_cost: calculateServiceMaterialCost(service.materials || []),
        })),
        labor_cost: tradeTotals.labor_cost,
        material_cost: tradeTotals.material_cost,
        trade_total: tradeTotals.trade_total,
        markup: tradeTotals.markup,
      };
    }),
  }));
};

// Format currency display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format percentage display
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

// Validation functions
export const validateCalculation = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value >= 0;
};

export const validatePercentage = (value: number): boolean => {
  return validateCalculation(value) && value <= 100;
};
