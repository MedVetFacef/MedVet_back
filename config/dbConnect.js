import mongoose from "mongoose";

export const connectDatabase = async () => {
  const DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.warn("⚠️  DB_URI não configurada. MongoDB não será conectado.");
    return;
  }

  try {
    const con = await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB conectado: ${con.connection.host}`);
    
    // Tratamento de erros de conexão após conectar
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconectado');
    });
    
  } catch (err) {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    // Não encerra o servidor, apenas loga o erro
    // O servidor pode funcionar sem MongoDB se não for usado
  }
};