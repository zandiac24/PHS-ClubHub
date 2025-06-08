//trigger sem2 emails
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const baseUrl = process.env.BASE_URL || 'https://phs-clubhub.vercel.app';
  const totalBatches = 4; 
  
  try {
    const results = [];
    
    //execute batches sequentially with delay between them
    for (let batchNumber = 1; batchNumber <= totalBatches; batchNumber++) {
      console.log(`Starting batch ${batchNumber}/${totalBatches}`);
      
      try {
        const response = await fetch(`${baseUrl}/api/cron-sem2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          },
          body: JSON.stringify({
            batchNumber,
            totalBatches
          })
        });

        const data = await response.json();
        results.push({
          batch: batchNumber,
          status: response.status,
          data
        });

        console.log(`Batch ${batchNumber} result:`, data);
        
        //add delay between batches to avoid overwhelming the system
        if (batchNumber < totalBatches) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (batchError) {
        console.error(`Batch ${batchNumber} failed:`, batchError);
        results.push({
          batch: batchNumber,
          status: 500,
          error: batchError instanceof Error ? batchError.message : 'Unknown error'
        });
      }
    }

    const successfulBatches = results.filter(r => r.status === 200).length;
    const totalProcessed = results.reduce((sum, r) => 
      sum + (r.data?.results?.processed || 0), 0
    );
    const totalSuccess = results.reduce((sum, r) => 
      sum + (r.data?.results?.success || 0), 0
    );

    return new Response(JSON.stringify({
      message: 'Batched email job completed',
      summary: {
        totalBatches,
        successfulBatches,
        totalProcessed,
        totalSuccess,
        results
      }
    }), { status: 200 });
    
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Failed to execute batched cron job', detail: error.message }),
      { status: 500 }
    );
  }
}