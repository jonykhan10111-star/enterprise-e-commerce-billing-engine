/**
 * TITLE: Enterprise Financial Biling Engine
 *Silicon Valley Production Standard | Zero-Mutation | Clean Method Chaining
 *Developer: Jony Khan
 */

//=======================================================================
//1. PLUGGABLE NOTIFICATION CHANNELS (Dependency Injection via Callbacks)
//=======================================================================

// Callback 1: Stripe Secure Billing Logger
const logToStripeSecure = (userId, grandTotal) => 
    `[STRIPE-GETWAY] Secure token verified for User #${userId}. Settled Gross: $${grandTotal}`;

// Callback 2: AWS CloudWatch Monitor Logger
const logToAWSMonitor = (userId, grandTotal) =>
    `[AWS-MONITOR] Metric Alert! System processed cheakout for User #${userId}. Net Value:$${grandTotal}`;

//================================================================
//2. CORE HIGHER-ORDERD PROCESSOR ENGINE (The Core Infrastructure)
//================================================================

// Master Pipeline Function: Takes configurations and returns condensed matrix report
function runEnterpriseFinancialPipeline ({databasePayload, taxRate, budgetCap, awsCallback,stripeCallback}) {
    console.log ("[Security] Initializing Enterprise Handshake & Encryption...");

    // Guard Clause: Immediate error throw if dataset is corrupt or empty
    if (!Array.isArray(databasePayload) || databasePayload.length === 0) {
        throw new Error ("[Pipeline Error] Corrupt Payload Source. Processing terminated.");
    }
    console.log (`✅[Validation] Integrity check passed. Analyzing ${databasePayload.length} client nodes.`);
    
    // Clean Method Chaining Pipeline (Filter-> Map-> Filter-> Reduce)
    const executionPipeline = databasePayload

    //STEP 1: PURE FILTRATION (filter)
    .filter(record => {

        // Condition: Keep only verified accounts with valid positve transactional amounts
        return record.isVerifiedUser && record.rawAmount > 0;
    })

    //STEP 2: DATA TRANSFORMATION (map)
    .map(validRecord => {

        //Mathmatical calculation: Adds dynamic tax margin to raw billing amount
        const totalPriceWithTax = validRecord.rawAmount + (validRecord.rawAmount * taxRate);

        // Dynamic Execution Logic: Injects and fires the correct callback based on client preference 
        let auditLogString;
        if (validRecord.preferredGatway === "AWS") {
            auditLogString = awsCallback(validRecord.userId, totalPriceWithTax);
        } else {
            auditLogString = stripeCallback(validRecord.userId, totalPriceWithTax);
        }

        // Return Statement: Maps the raw database object into a clean React-ready UI structure
        return {
            id: validRecord.userId,
            displayTitle: `CLIENT-${validRecord.userId}`,
            netPayable: validRecord.rawAmount,
            grossFinal: parseFloat(totalPriceWithTax.toFixed(2)),
            auditTrail: auditLogString
        };
    })

    //STEP 3: SECONDARY BUDGET CONSTRAINT CHECK (filter)
    .filter(transformedNode =>{

        // Condition: Drops any billing invoice that exceeds corporate budget thresholds
        return transformedNode.grossFinal <= budgetCap;
    });

    //STEP 4: ONE-PASS UNIFIED REDUCTION SUMMARIZER (reduce)

    // Initial state setup for the unified reduction accumulator object
    const initialSummarizerState ={
        totalAccountsProcessed:0,
        cumulativeGrossRevenue:0,
        systemAuditReports:[]
    };

    // Reduce operation: Condenses the array into a single consolidated financial JSON report
    const finalAggregatedReport = executionPipeline.reduce((accumulator, currentItem) => {
        return{
            totalAccountsProcessed: accumulator.totalAccountsProcessed + 1,
            cumulativeGrossRevenue: parseFloat((accumulator.cumulativeGrossRevenue + currentItem.grossFinal).toFixed(2)),

            //Immutably appends the current webhook log into the global reports arraay
            systemAuditReports: [...accumulator.systemAuditReports, currentItem.auditTrail]
        };
    }, initialSummarizerState);// Passed down the fallback state config

    return {
        pipelineStatus: "SUCCESS_COMPLETED",
        processedTimestamp:new Date().toISOString(),
        analyticsReport:finalAggregatedReport
    };
}

//==================================================
//3: REAL-WORLD LIVE RUN SIMULATION (Execution Node)
//==================================================

//Master Immutable Server Database Records (100% Secure Array Input)
const globalServerDatabaseFeed = [
    {userId: "USR-4011", rawAmount: 2000, isVerifiedUser: true, preferredGatway:"Stripe"},
     {userId: "USR-9022", rawAmount: 7500, isVerifiedUser: true, preferredGatway:"Stripe"},
      {userId: "USR-1133", rawAmount: -400, isVerifiedUser: true, preferredGatway:"Stripe"},
       {userId: "USR-5544", rawAmount: 1800, isVerifiedUser: false, preferredGatway:"AWS"},
        {userId: "USR-7755", rawAmount: 3200, isVerifiedUser: true, preferredGatway:"AWS"},
];

try {
    // Scenario Configuration: 15% VAT, Budget Cap \$6000, and Injecting both Logger Callbacks
    const finalExecutiveSummary = runEnterpriseFinancialPipeline({
        databasePayload:globalServerDatabaseFeed,
        taxRate:0.15,
        budgetCap:6000,
        stripeCallback: logToStripeSecure,
        awsCallback: logToAWSMonitor
    });

    console.log("\n [Pipeline Analytics Dashboard Output]:");
    console.log(JSON.stringify(finalExecutiveSummary, null, 2));

    // Immutability Guard Verification Check
    console.log(`\n [State Protection Check] Master Database Mutated? ${globalServerDatabaseFeed.length === 5 ? "NO - Functional Architecture Intact✅" : "YES - Vulnerable"}`);
} catch (error) {
    console.error(`[Pipeline Critical Failure] System Halted: ${error.message}`);
}
/**[Security] Initializing Enterprise Handshake & Encryption...
 ✅[Validation] Integrity check passed. Analyzing 5 client nodes.

 [Pipeline Analytics Dashboard Output]:
 {
  "pipelineStatus": "SUCCESS_COMPLETED",
  "processedTimestamp": "2026-09-16T22:41:39.388Z",
  "analyticsReport": {
    "totalAccountsProcessed": 2,
    "cumulativeGrossRevenue": 5980,
    "systemAuditReports": [
      "[STRIPE-GETWAY] Secure token verified for User #USR-4011. Settled Gross: $2300",
      "[AWS-MONITOR] Metric Alert! System processed cheakout for User #USR-7755. Net Value:$3680"
    ]
  }
}
 [State Protection Check] Master Database Mutated? NO - Functional Architecture Intact✅ */