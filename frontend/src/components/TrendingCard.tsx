import { motion } from "framer-motion";
import { TrendingUp, Users, Image, Hash } from "lucide-react";

const TrendingCard = () => {
  const trends = [
    { tag: "doğa", posts: 1243 },
    { tag: "seyahat", posts: 892 },
    { tag: "fotoğrafçılık", posts: 654 },
    { tag: "günbatımı", posts: 421 },
  ];

  const stats = [
    { icon: Users, label: "Kullanıcı", value: "12.4K" },
    { icon: Image, label: "Gönderi", value: "48.2K" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl border border-border p-5 space-y-5"
    >
      {/* Trending Tags */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Trendler</h3>
        </div>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.tag}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {trend.tag}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {trend.posts} gönderi
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-secondary rounded-xl p-3 text-center hover:scale-105 transition-transform"
          >
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
        © 2024 Picstream
      </p>
    </motion.div>
  );
};

export default TrendingCard;
