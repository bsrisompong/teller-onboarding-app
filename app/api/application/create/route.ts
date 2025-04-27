import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// import { prisma } from '@/libs/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // new customer?
    // const customer = await prisma.customer.findUnique({
    //   where: {
    //     citizenId: data.citizenId,
    //   },
    // });
    // if (!customer) {
    //   // create new customer
    //   const newCustomer = await prisma.customer.create({
    //     data: data,
    //   });
    // }

    // // create new application
    // const application = await prisma.application.create({
    //   data: {
    //     customerId: customer.id,
    //   },
    // });

    // mock new customer
    const customer = {
      id: nanoid(),
      citizenId: data.citizenId,
      name: data.name,
      surname: data.surname,
      accountNumber: data.accountNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // mock new application
    const application = {
      id: nanoid(),
      customerId: customer.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      applicationId: application.id,
      status: 'success',
      received: data,
      customer,
      application,
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid request' }, { status: 400 });
  }
}
